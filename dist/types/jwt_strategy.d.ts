/// <reference types="node" />
import { Strategy } from "passport";
import type { JwtFromRequestFunction } from "./extract_jwt";
import type { Request as ExpressRequest } from "express";
import type { JwtProvidedDriver, DefaultPayload, JwtDriver } from "./platforms/base";
export declare type SecretOrKeyProvider<Key = string> = SecretOrKeyProviderCallbackStyle<Key> | SecretOrKeyProviderPromiseStyle<Key>;
export declare type SecretOrKeyProviderCallbackStyle<Key> = (req: ExpressRequest, rawJwtToken: string, callback: ProviderDoneCallback<Key>) => void;
export declare type SecretOrKeyProviderPromiseStyle<Key> = (req: ExpressRequest, rawJwtToken: string) => Promise<Key | null>;
export declare type ProviderDoneCallback<Key> = (secretOrKeyError: string | null, secretOrKey: Key | null) => void;
export declare type DoneCallback = (error: Error | null | string, user: object | null | boolean, infoOrMessage?: string | object | number | {
    message: string;
}) => void;
export declare type VerifyCallback<Payload extends DefaultPayload> = (user: Payload, done: DoneCallback) => void;
export declare type VerifyCallbackWithReq<Payload extends DefaultPayload> = (req: ExpressRequest, payload: Payload, done: DoneCallback) => void;
export declare type UnifiedVerifyCallback<Payload extends DefaultPayload, Request extends boolean> = Request extends true ? VerifyCallbackWithReq<Payload> : VerifyCallback<Payload>;
export interface JwtStrategyOptionsBase<Request extends boolean> {
    jwtFromRequest: JwtFromRequestFunction;
    passReqToCallback?: Request;
    secretOrKeyProviderTimeoutSeconds?: number;
}
export declare type ProviderOrValueDriver = {
    jwtDriver: JwtProvidedDriver<any, any>;
    secretOrKey?: undefined;
    secretOrKeyProvider?: undefined;
};
export declare type ProviderOrValueBase<Key, OmitValue extends string> = (Omit<{
    jwtDriver: JwtDriver<any, any, Key>;
    secretOrKey?: undefined;
    secretOrKeyProvider: SecretOrKeyProvider<Key>;
}, OmitValue> | Omit<{
    jwtDriver: JwtDriver<any, any, Key>;
    secretOrKey: Key;
    secretOrKeyProvider?: undefined;
}, OmitValue>);
export declare type ProviderOrValue<Key> = ProviderOrValueBase<Key, "nothing"> | ProviderOrValueDriver;
export declare type JwtStrategyOptions<Key = string, Request extends boolean = boolean> = ProviderOrValue<Key> & JwtStrategyOptionsBase<Request>;
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
export declare class JwtStrategy<Payload extends DefaultPayload = DefaultPayload, Key = string, Request extends boolean = false> extends Strategy {
    protected static ignoreLegacy: boolean;
    name: string;
    private secretOrKeyProvider;
    private verify;
    private jwtFromRequest;
    private passReqToCallback;
    private driver;
    private secretOrKeyProviderTimeout;
    constructor(extOptions: JwtStrategyOptions<Key, Request>, verify: UnifiedVerifyCallback<Payload, Request>);
    protected callbackGenerator(): DoneCallback;
    protected processTokenInternal(secretOrKeyError: string | null, secretOrKey: Key | null, token: string, req: ExpressRequest, timeout?: NodeJS.Timeout): void;
    authenticate(req: ExpressRequest): void;
}
