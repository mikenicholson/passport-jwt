import * as index from "./dist/types/index";
import * as base from "./dist/types/platforms/base";
import * as strategy from "./dist/types/jwt_strategy";

declare module "passport-jwt" {
    export class Strategy<Payload extends base.DefaultPayload = base.DefaultPayload, Key = string, Request extends boolean = false> extends index.Strategy<Payload, Key, Request> {}
    export const ErrorMessages: index.ErrorMessages;
    export const FailureMessages: index.FailureMessages;
    export class ExtractJwt extends index.ExtractJwt {}
    export abstract class JwtDriver<Core = any, Options = any, Key = any> extends index.JwtDriver<Core, Options, Key> {}
    export abstract class JwtProvidedDriver<Core = any, Options = any> extends index.JwtProvidedDriver<Core, Options> {}
    export type JwtStrategyOptions<Key = string, Request extends boolean = boolean> = index.JwtStrategyOptions<Key, Request>;
    export type JwtFromRequestFunction = index.JwtFromRequestFunction;
    export type JwtResult<Payload extends base.DefaultPayload = base.DefaultPayload> = index.JwtResult<Payload>;
    export type VerifyCallback<Payload extends base.DefaultPayload = base.DefaultPayload> = index.VerifyCallback<Payload>;
    export type VerifyCallbackWithReq<Payload extends base.DefaultPayload = base.DefaultPayload> = index.VerifyCallbackWithReq<Payload>;
    export type SecretOrKeyProvider<Key = string> = index.SecretOrKeyProvider<Key>;
}

import "./auto";
import "./platform-nestjsjwt";
import "./platform-jose";
import "./platform-jsonwebtoken"
