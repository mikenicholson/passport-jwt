import { Strategy } from "passport";
import type { JwtExtractor } from "./extract_jwt";
import type { Request } from "express";
import type { JwtDriver } from "./platforms/base";
export declare type SecretOrKeyProvider<T = string> = (req: Request, rawJwtToken: string, callback: (secretOrKeyError: string | null, secretOrKey: T) => void) => void;
export declare type Verified<T extends Record<string, any>> = (error: Error | null | string, user: T | null, infoOrMessage?: string | object) => void;
export declare type Payload = Record<string, any> | null | undefined;
export declare type VerifyCallback<T extends Record<string, any>> = (user: T, callback: Verified<T>) => boolean;
export declare type VerifyCallbackWithReq = (req: Request, payload: Payload, callback: Verified<object>) => boolean;
export declare enum FailureMessages {
    NO_TOKEN_ASYNC = "No auth token has been resolved",
    NO_TOKEN = "No auth token"
}
export interface JwtStrategyOptionsBase<T = string> {
    jwtDriver: JwtDriver<any, any, T>;
    jwtFromRequest: JwtExtractor;
    passReqToCallback?: boolean;
}
export declare type ProviderOrValue<T = string> = ({
    secretOrKeyProvider: SecretOrKeyProvider<T>;
} | {
    secretOrKey: T;
});
export declare type JwtStrategyOptions<T = string> = ProviderOrValue<T> & JwtStrategyOptionsBase;
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
export declare class JwtStrategy<T extends Record<string, any>> extends Strategy {
    protected static ignoreLegacy: boolean;
    name: string;
    private secretOrKeyProvider;
    private verify;
    private jwtFromRequest;
    private passReqToCallback;
    private driver;
    constructor(extOptions: JwtStrategyOptions, verify: VerifyCallback<T>);
    private verifiedInternal;
    authenticate(req: Request): void;
}
