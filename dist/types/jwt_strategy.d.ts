import { Strategy } from "passport";
import type { JwtExtractor } from "./extract_jwt";
import type { Request } from "express";
import type { JwtDriver } from "./platforms/base";
export declare type SecretOrKeyProvider<Key> = (req: Request, rawJwtToken: string, callback: (secretOrKeyError: string | null, secretOrKey: Key) => void) => void;
export declare type DefaultPayload = Record<string, any>;
export declare type DoneCallback = (error: Error | null | string, user: object | null, infoOrMessage?: string | object) => void;
export declare type VerifyCallback<Payload extends DefaultPayload> = (user: Payload, done: DoneCallback) => void;
export declare type VerifyCallbackWithReq<Payload extends DefaultPayload> = (req: Request, payload: Payload, done: DoneCallback) => void;
export declare type BasicVerifyCallback = (reqOrUser: any, payloadOrDone: any, done?: any) => void;
export declare enum FailureMessages {
    NO_TOKEN_ASYNC = "No auth token has been resolved",
    NO_TOKEN = "No auth token"
}
export interface JwtStrategyOptionsBase<Key> {
    jwtDriver: JwtDriver<any, any, Key>;
    jwtFromRequest: JwtExtractor;
    passReqToCallback?: boolean;
}
export declare type ProviderOrValue<Key> = ({
    secretOrKeyProvider: SecretOrKeyProvider<Key>;
} | {
    secretOrKey: Key;
});
export declare type JwtStrategyOptions<Key = string> = ProviderOrValue<Key> & JwtStrategyOptionsBase<Key>;
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
export declare class JwtStrategy<Payload extends DefaultPayload = DefaultPayload, Verify extends BasicVerifyCallback = VerifyCallback<Payload>, Key = string> extends Strategy {
    protected static ignoreLegacy: boolean;
    name: string;
    private secretOrKeyProvider;
    private verify;
    private jwtFromRequest;
    private passReqToCallback;
    private driver;
    constructor(extOptions: JwtStrategyOptions<Key>, verify: Verify);
    protected verifiedInternal(err: Error | null | string, user: null | object, infoOrMessage?: string | object): void;
    protected processTokenInternal(secretOrKeyError: string | null, secretOrKey: Key, token: string, req: Request): void;
    authenticate(req: Request): void;
}
