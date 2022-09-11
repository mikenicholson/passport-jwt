"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = exports.FailureMessages = void 0;
var tslib_1 = require("tslib");
var passport_1 = require("passport");
var FailureMessages;
(function (FailureMessages) {
    FailureMessages["NO_KEY_FROM_PROVIDER"] = "Provider did not return a key.";
    FailureMessages["NO_TOKEN_ASYNC"] = "No auth token has been resolved";
    FailureMessages["NO_TOKEN"] = "No auth token";
})(FailureMessages = exports.FailureMessages || (exports.FailureMessages = {}));
/**
 * Strategy constructor
 *
 * @param options
 *          secretOrKey: String or buffer containing the secret or PEM-encoded public key. Required unless secretOrKeyProvider is provided.
 *          secretOrKeyProvider: callback in the format secretOrKeyProvider(request, rawJwtToken, done)`,
 *                               which should call done with a secret or PEM-encoded public key
 *                               (asymmetric) for the given undecoded jwt token string and  request
 *                               combination. done has the signature function done(err, secret).
 *                               REQUIRED unless `secretOrKey` is provided.
 *          jwtFromRequest: (REQUIRED) Function that accepts a request as the only parameter and returns the either JWT as a string or null
 *          issuer: If defined issuer will be verified against this value
 *          audience: If defined audience will be verified against this value
 *          algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
 *          ignoreExpiration: if true do not validate the expiration of the token.
 *          passReqToCallback: If true the verify callback will be called with args (request, jwt_payload, done_callback).
 * @param verify - Verify callback with args (jwt_payload, done_callback) if passReqToCallback is false,
 *                 (request, jwt_payload, done_callback) if true.
 */
var JwtStrategy = /** @class */ (function (_super) {
    tslib_1.__extends(JwtStrategy, _super);
    function JwtStrategy(extOptions, verify) {
        var _this = this;
        var _a;
        _this = _super.call(this) || this;
        _this.name = "jwt";
        var options = extOptions;
        _this.secretOrKeyProvider = options.secretOrKeyProvider;
        _this.checkIfProviderWorksTimeout = (_a = options.checkIfProviderWorksTimeout) !== null && _a !== void 0 ? _a : 30000;
        _this.driver = options.jwtDriver;
        if (!_this.driver) {
            throw new TypeError("JwtStrategy requires a driver to function (see option jwtDriver) or alternatively import the strategy from 'passport-jwt/auto' to auto register the driver");
        }
        if (_this.driver["keyIsProvidedByMe"]) {
            if (options.secretOrKey || options.secretOrKeyProvider) {
                throw new TypeError("SecretOrKey is provided by the driver and cannot be given as an option.");
            }
            options.secretOrKey = "set by driver";
        }
        if (options.secretOrKey) {
            if (_this.secretOrKeyProvider) {
                throw new TypeError('JwtStrategy has been given both a secretOrKey and a secretOrKeyProvider');
            }
            _this.secretOrKeyProvider = function (request, rawJwtToken, done) {
                done(null, options.secretOrKey);
            };
        }
        if (!_this.constructor["ignoreLegacy"] && (options.jsonWebTokenOptions || options.issuer || options.audience)) {
            throw new TypeError("JwtStrategy has gained a JsonWebToken option, this is no longer supported in the current version. You can pass these options to the driver instead or import the library from 'passport-jwt/auto' to keep the legacy options.");
        }
        if (!_this.secretOrKeyProvider) {
            throw new TypeError('JwtStrategy requires a secret or key');
        }
        _this.verify = verify;
        if (!_this.verify) {
            throw new TypeError('JwtStrategy requires a verify callback');
        }
        _this.jwtFromRequest = options.jwtFromRequest;
        if (!_this.jwtFromRequest) {
            throw new TypeError('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)');
        }
        _this.passReqToCallback = !!options.passReqToCallback;
        return _this;
    }
    JwtStrategy.prototype.verifiedInternal = function (err, user, infoOrMessage) {
        if (err) {
            if (typeof err === 'string') {
                err = new Error(err);
            }
            return this.error(err);
        }
        else if (!user && typeof infoOrMessage === "string") {
            return this.fail(infoOrMessage);
        }
        else if (user && typeof infoOrMessage !== "string") {
            return this.success(user, infoOrMessage);
        }
    };
    ;
    JwtStrategy.prototype.processTokenInternal = function (secretOrKeyError, secretOrKey, token, req, timeout) {
        var _this = this;
        if (this.checkIfProviderWorksTimeout !== -1) {
            this.checkIfProviderWorksTimeout = -1;
            clearTimeout(timeout);
        }
        if (secretOrKeyError || !secretOrKey) {
            return this.fail(secretOrKeyError !== null && secretOrKeyError !== void 0 ? secretOrKeyError : FailureMessages.NO_KEY_FROM_PROVIDER);
        }
        // Verify the JWT
        this.driver.validate(token, secretOrKey).then(function (result) {
            if (!result.success) {
                if (result.message) {
                    return _this.fail(result.message);
                }
                else {
                    return _this.error(new Error("Unknown Driver Error"));
                }
            }
            try {
                if (_this.passReqToCallback) {
                    _this.verify(req, result.payload, function (error, user, infoOrMessage) { return _this.verifiedInternal(error, user, infoOrMessage); });
                }
                else {
                    _this.verify(result.payload, function (error, user, infoOrMessage) { return _this.verifiedInternal(error, user, infoOrMessage); });
                }
            }
            catch (ex) {
                _this.error(ex);
            }
        });
    };
    JwtStrategy.prototype.authenticate = function (req) {
        var _this = this;
        var tokenOrPromise = this.jwtFromRequest(req);
        var timeout = undefined;
        if (typeof tokenOrPromise === "string") {
            tokenOrPromise = Promise.resolve(tokenOrPromise);
        }
        else if (!(tokenOrPromise instanceof Promise)) {
            return this.fail(FailureMessages.NO_TOKEN);
        }
        tokenOrPromise.then(function (token) {
            if (!token) {
                return _this.fail(FailureMessages.NO_TOKEN_ASYNC);
            }
            if (_this.checkIfProviderWorksTimeout !== -1) {
                // 30 seconds should be enough for a provider to give a secret the first time.
                timeout = setTimeout(function () { return _this.error(new TypeError("Provider did timeout, if you are sure it works you can disable the timeout check by setting checkIfProviderWorksTimeout to -1.")); }, _this.checkIfProviderWorksTimeout);
            }
            var provided = _this.secretOrKeyProvider(req, token, function (err, key) { return _this.processTokenInternal(err, key, token, req, timeout); });
            if (provided) {
                if (provided instanceof Promise) {
                    provided
                        .then(function (key) { return _this.processTokenInternal(null, key, token, req, timeout); })
                        .catch(function (error) {
                        clearTimeout(timeout);
                        _this.error(error);
                    });
                }
                else {
                    clearTimeout(timeout);
                    _this.error(new TypeError("SecretOrKeyProvider provided something other then Promise"));
                }
            }
        }).catch(function (error) {
            _this.error(error);
        });
    };
    ;
    JwtStrategy.ignoreLegacy = false;
    return JwtStrategy;
}(passport_1.Strategy));
exports.JwtStrategy = JwtStrategy;
