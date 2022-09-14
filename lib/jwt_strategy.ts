import {Strategy} from "passport";
import type {JwtFromRequestFunction} from "./extract_jwt";
import type {Request as ExpressRequest} from "express";
import type {JwtProvidedDriver, DefaultPayload, JwtDriver} from "./platforms/base";
import {ErrorMessages, FailureMessages} from "./error_messages";

export type SecretOrKeyProvider<Key = string> = SecretOrKeyProviderCallbackStyle<Key> | SecretOrKeyProviderPromiseStyle<Key>;
export type SecretOrKeyProviderCallbackStyle<Key> = (req: ExpressRequest, rawJwtToken: string, callback: ProviderDoneCallback<Key>) => void;
export type SecretOrKeyProviderPromiseStyle<Key> = (req: ExpressRequest, rawJwtToken: string) => Promise<Key | null>;
export type ProviderDoneCallback<Key> = (secretOrKeyError: string | null, secretOrKey: Key | null) => void;
export type DoneCallback = (error: Error | null | string, user: object | null | boolean, infoOrMessage?: string | object | number | { message: string }) => void;
export type VerifyCallback<Payload extends DefaultPayload> = (user: Payload, done: DoneCallback) => void;
export type VerifyCallbackWithReq<Payload extends DefaultPayload> = (req: ExpressRequest, payload: Payload, done: DoneCallback) => void;
export type UnifiedVerifyCallback<Payload extends DefaultPayload, Request extends boolean> = Request extends true ? VerifyCallbackWithReq<Payload> : VerifyCallback<Payload>;

export interface JwtStrategyOptionsBase<Request extends boolean> {
    jwtFromRequest: JwtFromRequestFunction;
    passReqToCallback?: Request;
    secretOrKeyProviderTimeoutSeconds?: number;
}

export type ProviderOrValueDriver = {
    jwtDriver: JwtProvidedDriver<any, any>;
    secretOrKey?: undefined;
    secretOrKeyProvider?: undefined;
}

export type ProviderOrValueBase<Key, OmitValue extends string> = (Omit<{
    jwtDriver: JwtDriver<any, any, Key>;
    secretOrKey?: undefined;
    secretOrKeyProvider: SecretOrKeyProvider<Key>;
}, OmitValue> | Omit<{
    jwtDriver: JwtDriver<any, any, Key>;
    secretOrKey: Key;
    secretOrKeyProvider?: undefined;
}, OmitValue>);

type ProviderAndValue<Key> = ({
    jwtDriver: JwtDriver<any, any, Key>;
    secretOrKeyProvider?: SecretOrKeyProvider<Key>;
    secretOrKey?: Key;
    jsonWebTokenOptions: undefined;
    issuer: string;
    audience: string;
})

export type ProviderOrValue<Key> = ProviderOrValueBase<Key, "nothing"> | ProviderOrValueDriver;
export type JwtStrategyOptions<Key = string, Request extends boolean = boolean> =
    ProviderOrValue<Key>
    & JwtStrategyOptionsBase<Request>;
type JwtStrategyOptionsInternal<Key, Request extends boolean> = ProviderAndValue<Key> & JwtStrategyOptionsBase<Request>;

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
export class JwtStrategy<Payload extends DefaultPayload = DefaultPayload,
    Key = string, Request extends boolean = false> extends Strategy {

    protected static ignoreLegacy = false;

    public name = "jwt";
    private secretOrKeyProvider: SecretOrKeyProvider<Key>;
    private verify: UnifiedVerifyCallback<Payload, Request>;
    private jwtFromRequest: JwtFromRequestFunction;
    private passReqToCallback: boolean;
    private driver: JwtDriver<any, any, Key>;
    private secretOrKeyProviderTimeout: number;

    constructor(extOptions: JwtStrategyOptions<Key, Request>, verify: UnifiedVerifyCallback<Payload, Request>) {
        super();
        const options = extOptions as JwtStrategyOptionsInternal<Key, Request>;

        this.secretOrKeyProvider = options.secretOrKeyProvider!;
        this.secretOrKeyProviderTimeout = (options.secretOrKeyProviderTimeoutSeconds ?? 30) * 1000;
        this.driver = options.jwtDriver;
        this.verify = verify;
        this.passReqToCallback = !!options.passReqToCallback;
        this.jwtFromRequest = options.jwtFromRequest;

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
            options.secretOrKey = "set by driver" as any;
        }

        if (options.secretOrKey) {
            if (this.secretOrKeyProvider!) {
                throw new TypeError(ErrorMessages.BOTH_KEY_AND_PROVIDER);
            }
            this.secretOrKeyProvider = (request, rawJwtToken, done) => {
                done(null, options.secretOrKey!)
            };
        }

        if (!this.constructor["ignoreLegacy"] && (options.jsonWebTokenOptions || options.issuer || options.audience)) {
            throw new TypeError(ErrorMessages.LEGACY_OPTIONS_PASSED);
        }

        if (!this.secretOrKeyProvider) {
            throw new TypeError(ErrorMessages.NO_SECRET_KEY);
        }

        if (!this.verify) {
            throw new TypeError(ErrorMessages.NO_VERIFY_CALLBACK);
        }

        if (!this.jwtFromRequest) {
            throw new TypeError(ErrorMessages.NO_EXTRACTOR_FOUND);
        }
    }

    protected callbackGenerator(): DoneCallback {
        return (err, user, infoOrMessage) => {
            if (err) {
                if (typeof err === 'string') {
                    err = new Error(err);
                }
                return this.error(err);
            }
            if (user) {
                if (typeof infoOrMessage === 'undefined' || typeof infoOrMessage === 'object') {
                    return this.success(user, infoOrMessage);
                } else {
                    return this.error(new TypeError(ErrorMessages.USER_TRUE_WITH_MESSAGE));
                }
            }
            // fail must be a string in the new passport
            if (typeof infoOrMessage === 'object' && 'message' in infoOrMessage) {
                infoOrMessage = infoOrMessage.message;
            }
            if (typeof infoOrMessage === 'string' || typeof infoOrMessage === 'number') {
                return this.fail(infoOrMessage);
            }
            return this.fail(FailureMessages.USER_NOT_TRUTHY);
        }
    };

    protected processTokenInternal(secretOrKeyError: string | null, secretOrKey: Key | null, token: string, req: ExpressRequest, timeout?: NodeJS.Timeout): void {
        if (this.secretOrKeyProviderTimeout !== -1) {
            this.secretOrKeyProviderTimeout = -1;
            clearTimeout(timeout);
        }
        if (secretOrKeyError || !secretOrKey) {
            return this.fail(secretOrKeyError ?? FailureMessages.NO_KEY_FROM_PROVIDER);
        }
        // Verify the JWT
        this.driver.validate<Payload>(token, secretOrKey).then((result) => {
            if (!result.success) {
                if (typeof result.message === "string") {
                    return this.fail(result.message);
                } else {
                    return this.error(new Error(ErrorMessages.NO_DRIVER_FAILURE_INFO));
                }
            }
            try {
                if (this.passReqToCallback) {
                    (this.verify as UnifiedVerifyCallback<Payload, true>)(req, result.payload, this.callbackGenerator());
                } else {
                    (this.verify as UnifiedVerifyCallback<Payload, false>)(result.payload, this.callbackGenerator());
                }
            } catch (ex) {
                this.error(ex);
            }
        })
    }

    public authenticate(req: ExpressRequest): void {
        let tokenOrPromise = this.jwtFromRequest(req);
        let timeout: NodeJS.Timeout | undefined = undefined;
        if (typeof tokenOrPromise === "string") {
            tokenOrPromise = Promise.resolve(tokenOrPromise);
        } else if (!(tokenOrPromise instanceof Promise)) {
            return this.fail(FailureMessages.NO_TOKEN);
        }
        tokenOrPromise.then((token: string | null) => {
            if (!token) {
                return this.fail(FailureMessages.NO_TOKEN_ASYNC);
            }
            if (this.secretOrKeyProviderTimeout !== -1) {
                // 30 seconds should be enough for a provider to give a secret the first time.
                timeout = setTimeout(
                    () => this.error(new TypeError(ErrorMessages.PROVIDER_TIME_OUT)),
                    this.secretOrKeyProviderTimeout
                );
            }
            const provided = this.secretOrKeyProvider(req, token,
                (err, key) => this.processTokenInternal(err, key, token, req, timeout)
            );
            if (provided) {
                if (provided instanceof Promise) {
                    provided
                        .then(key => this.processTokenInternal(null, key, token, req, timeout))
                        .catch(error => {
                            timeout ? clearTimeout(timeout) : void 0;
                            this.error(error)
                        });
                } else {
                    timeout ? clearTimeout(timeout) : void 0;
                    this.error(new TypeError(ErrorMessages.NO_PROMISE_RETURNED));
                }
            }
        }).catch((error) => {
            this.error(error);
        });
    };
}
