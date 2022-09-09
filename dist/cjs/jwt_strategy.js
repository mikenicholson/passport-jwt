"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
var tslib_1 = require("tslib");
var passport_1 = require("passport");
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
        var _this = _super.call(this) || this;
        _this.name = "jwt";
        var options = extOptions;
        _this.secretOrKeyProvider = options.secretOrKeyProvider;
        _this.driver = options.jwtDriver;
        if (!_this.driver) {
            throw new TypeError("JwtStrategy requires a driver to function (see option jwtDriver) or alternatively import the strategy from 'passport-jwt/auto' to auto register the driver");
        }
        if (options.secretOrKey || _this.driver.constructor.name === "NestJsJwtDriver") {
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
    JwtStrategy.prototype.authenticate = function (req) {
        var _this = this;
        var tokenOrPromise = this.jwtFromRequest(req);
        if (typeof tokenOrPromise === "string") {
            tokenOrPromise = Promise.resolve(tokenOrPromise);
        }
        else if (!(tokenOrPromise instanceof Promise)) {
            return this.fail("No auth token");
        }
        tokenOrPromise.then(function (token) {
            if (!token) {
                return _this.fail("No auth token has been resolved");
            }
            _this.secretOrKeyProvider(req, token, function (secretOrKeyError, secretOrKey) {
                if (secretOrKeyError) {
                    return _this.fail(secretOrKeyError);
                }
                // Verify the JWT
                _this.driver.validate(token, secretOrKey).then(function (result) {
                    if (!result.success) {
                        if (result.message) {
                            return _this.fail(result.message);
                        }
                        else {
                            return _this.error(new Error("Unknown Driver Error, provide a message if the error is excepted"));
                        }
                    }
                    try {
                        if (_this.passReqToCallback) {
                            _this.verify(req, result.payload, function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return _this.verifiedInternal.apply(_this, args);
                            });
                        }
                        else {
                            _this.verify(result.payload, function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return _this.verifiedInternal.apply(_this, args);
                            });
                        }
                    }
                    catch (ex) {
                        _this.error(ex);
                    }
                });
            });
        }).catch(function (error) {
            _this.error(error);
        });
    };
    ;
    JwtStrategy.ignoreLegacy = false;
    return JwtStrategy;
}(passport_1.Strategy));
exports.JwtStrategy = JwtStrategy;
