import { Strategy } from "passport";
import { ErrorMessages, FailureMessages } from "./error_messages";
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
 *          jwtFromDriver: (REQUIRED) Validate Function that accepts a JWT signature, a key and the options below, and returns a validation message.
 *              issuer: If defined issuer will be verified against this value
 *              audience: If defined audience will be verified against this value
 *              algorithms: List of strings with the names of the allowed algorithms. For instance, ["HS256", "HS384"].
 *              ignoreExpiration: if true do not validate the expiration of the token.
 *          passReqToCallback: If true the verify callback will be called with args (request, jwt_payload, done_callback).
 * @param verify - Verify callback with args (jwt_payload, done_callback) if passReqToCallback is false,
 *                 (request, jwt_payload, done_callback) if true.
 */
export class JwtStrategy extends Strategy {
    constructor(extOptions, verify) {
        var _a;
        super();
        this.name = "jwt";
        const options = extOptions;
        this.secretOrKeyProvider = options.secretOrKeyProvider;
        this.checkIfProviderWorksTimeout = (_a = options.checkIfProviderWorksTimeout) !== null && _a !== void 0 ? _a : 30000;
        this.driver = options.jwtDriver;
        if (!this.driver) {
            throw new TypeError(ErrorMessages.NO_DRIVER_PROVIDED);
        }
        if (typeof this.driver !== "object" || !('validate' in this.driver) || typeof !this.driver.validate === "function") {
            throw new TypeError(ErrorMessages.INVALID_DRIVER);
        }
        if (this.driver["keyIsProvidedByMe"]) {
            if (options.secretOrKey || options.secretOrKeyProvider) {
                throw new TypeError(ErrorMessages.DRIVER_PROVIDES_KEY);
            }
            options.secretOrKey = "set by driver";
        }
        if (options.secretOrKey) {
            if (this.secretOrKeyProvider) {
                throw new TypeError(ErrorMessages.BOTH_KEY_AND_PROVIDER);
            }
            this.secretOrKeyProvider = (request, rawJwtToken, done) => {
                done(null, options.secretOrKey);
            };
        }
        if (!this.constructor["ignoreLegacy"] && (options.jsonWebTokenOptions || options.issuer || options.audience)) {
            throw new TypeError(ErrorMessages.LEGACY_OPTIONS_PASSED);
        }
        if (!this.secretOrKeyProvider) {
            throw new TypeError(ErrorMessages.NO_SECRET_KEY);
        }
        this.verify = verify;
        if (!this.verify) {
            throw new TypeError(ErrorMessages.NO_VERIFY_CALLBACK);
        }
        this.jwtFromRequest = options.jwtFromRequest;
        if (!this.jwtFromRequest) {
            throw new TypeError(ErrorMessages.NO_EXTRACTOR_FOUND);
        }
        this.passReqToCallback = !!options.passReqToCallback;
    }
    verifiedInternal(err, user, infoOrMessage) {
        if (err) {
            if (typeof err === 'string') {
                err = new Error(err);
            }
            return this.error(err);
        }
        if (user) {
            if (typeof infoOrMessage === 'undefined' || typeof infoOrMessage === 'object') {
                return this.success(user, infoOrMessage);
            }
            else {
                return this.error(new TypeError(ErrorMessages.USER_TURE_WITH_MESSAGE));
            }
        }
        // fail must be a string in the new passport
        if (typeof infoOrMessage === 'object' && 'message' in infoOrMessage) {
            infoOrMessage = infoOrMessage.message;
        }
        if (typeof infoOrMessage === 'string') {
            return this.fail(infoOrMessage);
        }
        return this.fail(FailureMessages.USER_NOT_TRUE);
    }
    ;
    processTokenInternal(secretOrKeyError, secretOrKey, token, req, timeout) {
        if (this.checkIfProviderWorksTimeout !== -1) {
            this.checkIfProviderWorksTimeout = -1;
            clearTimeout(timeout);
        }
        if (secretOrKeyError || !secretOrKey) {
            return this.fail(secretOrKeyError !== null && secretOrKeyError !== void 0 ? secretOrKeyError : FailureMessages.NO_KEY_FROM_PROVIDER);
        }
        // Verify the JWT
        this.driver.validate(token, secretOrKey).then((result) => {
            if (!result.success) {
                if (typeof result.message === "string") {
                    return this.fail(result.message);
                }
                else {
                    return this.error(new Error(ErrorMessages.NO_DRIVER_FAILURE_INFO));
                }
            }
            try {
                if (this.passReqToCallback) {
                    this.verify(req, result.payload, (error, user, infoOrMessage) => this.verifiedInternal(error, user, infoOrMessage));
                }
                else {
                    this.verify(result.payload, (error, user, infoOrMessage) => this.verifiedInternal(error, user, infoOrMessage));
                }
            }
            catch (ex) {
                this.error(ex);
            }
        });
    }
    authenticate(req) {
        let tokenOrPromise = this.jwtFromRequest(req);
        let timeout = undefined;
        if (typeof tokenOrPromise === "string") {
            tokenOrPromise = Promise.resolve(tokenOrPromise);
        }
        else if (!(tokenOrPromise instanceof Promise)) {
            return this.fail(FailureMessages.NO_TOKEN);
        }
        tokenOrPromise.then((token) => {
            if (!token) {
                return this.fail(FailureMessages.NO_TOKEN_ASYNC);
            }
            if (this.checkIfProviderWorksTimeout !== -1) {
                // 30 seconds should be enough for a provider to give a secret the first time.
                timeout = setTimeout(() => this.error(new TypeError(ErrorMessages.PROVIDER_TIME_OUT)), this.checkIfProviderWorksTimeout);
            }
            const provided = this.secretOrKeyProvider(req, token, (err, key) => this.processTokenInternal(err, key, token, req, timeout));
            if (provided) {
                if (provided instanceof Promise) {
                    provided
                        .then(key => this.processTokenInternal(null, key, token, req, timeout))
                        .catch(error => {
                        clearTimeout(timeout);
                        this.error(error);
                    });
                }
                else {
                    clearTimeout(timeout);
                    this.error(new TypeError(ErrorMessages.NO_PROMISE_RETURNED));
                }
            }
        }).catch((error) => {
            this.error(error);
        });
    }
    ;
}
JwtStrategy.ignoreLegacy = false;
//# sourceMappingURL=jwt_strategy.js.map