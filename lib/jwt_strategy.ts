import {Strategy} from "passport";
import type {JwtExtractor} from "./extract_jwt";
import type {Request} from "express";
import type {JwtDriver} from "./platforms/base";

export type SecretOrKeyProvider<Key> = (req: Request, rawJwtToken: string, callback: (secretOrKeyError: string | null, secretOrKey: Key) => void) => void;
export type DefaultPayload = Record<string, any>;
export type DoneCallback = (error: Error | null | string, user: object | null, infoOrMessage?: string | object) => void;
export type VerifyCallback<Payload extends DefaultPayload> = (user: Payload, done: DoneCallback) => void;
export type VerifyCallbackWithReq<Payload extends DefaultPayload> = (req: Request, payload: Payload, done: DoneCallback) => void;
export type BasicVerifyCallback = (reqOrUser: any, payloadOrDone: any, done?: any) => void;

export enum FailureMessages {
    NO_TOKEN_ASYNC = "No auth token has been resolved",
    NO_TOKEN = "No auth token",
}

export interface JwtStrategyOptionsBase<Key> {
    jwtDriver: JwtDriver<any, any, Key>;
    jwtFromRequest: JwtExtractor;
    passReqToCallback?: boolean;
}

export type ProviderOrValue<Key> = ({
    secretOrKeyProvider: SecretOrKeyProvider<Key>;
} | {
    secretOrKey: Key;
});

type ProviderAndValue<Key> = ({
    secretOrKeyProvider?: SecretOrKeyProvider<Key>;
    secretOrKey?: Key;
    jsonWebTokenOptions: undefined;
    issuer: string;
    audience: string;
})

export type JwtStrategyOptions<Key = string> = ProviderOrValue<Key> & JwtStrategyOptionsBase<Key>;
type JwtStrategyOptionsInternal<Key> = ProviderAndValue<Key> & JwtStrategyOptionsBase<Key>;

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
export class JwtStrategy<Payload extends DefaultPayload = DefaultPayload,
    Verify extends BasicVerifyCallback = VerifyCallback<Payload>, Key = string> extends Strategy {

    protected static ignoreLegacy = false;

    public name = "jwt";
    private secretOrKeyProvider: SecretOrKeyProvider<Key>;
    private verify: Verify;
    private jwtFromRequest: JwtExtractor;
    private passReqToCallback: boolean;
    private driver: JwtDriver<any, any, Key>;

    constructor(extOptions: JwtStrategyOptions<Key>, verify: Verify) {
        super();
        const options = extOptions as JwtStrategyOptionsInternal<Key>;
        this.secretOrKeyProvider = options.secretOrKeyProvider!;

        this.driver = options.jwtDriver;
        if (!this.driver) {
            throw new TypeError("JwtStrategy requires a driver to function (see option jwtDriver) or alternatively import the strategy from 'passport-jwt/auto' to auto register the driver");
        }

        if (options.secretOrKey || this.driver.constructor.name === "NestJsJwtDriver") {
            if (this.secretOrKeyProvider!) {
                throw new TypeError('JwtStrategy has been given both a secretOrKey and a secretOrKeyProvider');
            }
            this.secretOrKeyProvider = (request, rawJwtToken, done) => {
                done(null, options.secretOrKey!)
            };
        }

        if (!this.constructor["ignoreLegacy"] && (options.jsonWebTokenOptions || options.issuer || options.audience)) {
            throw new TypeError("JwtStrategy has gained a JsonWebToken option, this is no longer supported in the current version. You can pass these options to the driver instead or import the library from 'passport-jwt/auto' to keep the legacy options.");
        }

        if (!this.secretOrKeyProvider) {
            throw new TypeError('JwtStrategy requires a secret or key');
        }

        this.verify = verify;
        if (!this.verify) {
            throw new TypeError('JwtStrategy requires a verify callback');
        }

        this.jwtFromRequest = options.jwtFromRequest;
        if (!this.jwtFromRequest) {
            throw new TypeError('JwtStrategy requires a function to retrieve jwt from requests (see option jwtFromRequest)');
        }

        this.passReqToCallback = !!options.passReqToCallback;
    }

    protected verifiedInternal(err: Error | null | string, user: null | object, infoOrMessage?: string | object) {
        if (err) {
            if (typeof err === 'string') {
                err = new Error(err);
            }
            return this.error(err);
        } else if (!user && typeof infoOrMessage === "string") {
            return this.fail(infoOrMessage);
        } else if (user && typeof infoOrMessage !== "string") {
            return this.success(user, infoOrMessage);
        }
    };

    protected processTokenInternal(secretOrKeyError: string | null, secretOrKey: Key, token: string, req: Request): void {
        if (secretOrKeyError) {
            return this.fail(secretOrKeyError);
        }
        // Verify the JWT
        this.driver.validate<Payload>(token, secretOrKey).then((result) => {
            if (!result.success) {
                if (result.message) {
                    return this.fail(result.message);
                } else {
                    return this.error(new Error("Unknown Driver Error"));
                }
            }
            try {
                if (this.passReqToCallback) {
                    (this.verify as VerifyCallbackWithReq<Payload>)(req, result.payload,
                        (error, user, infoOrMessage) => this.verifiedInternal(error, user, infoOrMessage)
                    );
                } else {
                    (this.verify as VerifyCallback<Payload>)(result.payload,
                        (error, user, infoOrMessage) => this.verifiedInternal(error, user, infoOrMessage)
                    );
                }
            } catch (ex) {
                this.error(ex);
            }
        })
    }

    public authenticate(req: Request): void {
        let tokenOrPromise = this.jwtFromRequest(req);
        if (typeof tokenOrPromise === "string") {
            tokenOrPromise = Promise.resolve(tokenOrPromise);
        } else if (!(tokenOrPromise instanceof Promise)) {
            return this.fail(FailureMessages.NO_TOKEN);
        }
        tokenOrPromise.then((token: string | null) => {
            if (!token) {
                return this.fail(FailureMessages.NO_TOKEN_ASYNC);
            }
            this.secretOrKeyProvider(req, token,
                (err, key) => this.processTokenInternal(err, key, token, req)
            );
        }).catch((error) => {
            this.error(error);
        });
    };
}
