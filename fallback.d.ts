import * as index from "./dist/types/index";
import * as auto from "./dist/types/auto/index";
import * as jose from "./dist/types/platforms/jose";
import * as jsonwebtoken from "./dist/types/platforms/jsonwebtoken";
import * as nestjsjwt from "./dist/types/platforms/nestjsjwt";

declare module "passport-jwt" {
    export type JwtResult<T> = index.JwtResult<T>
    export class Strategy<T> extends index.Strategy<T> {}
    export abstract class JwtDriver<A, B, C> extends index.JwtDriver<A, B, C> {}
    export class ExtractJwt extends index.ExtractJwt {}
    export type JwtExtractorType = index.JwtExtractorType;
    export const FailureMessages: typeof index.FailureMessages;
    export type JwtStrategyOptions = index.JwtStrategyOptions;
}

declare module "passport-jwt/auto" {
    export class Strategy<T> extends auto.Strategy<T> {}
}

declare module "passport-jwt/platform-jose" {
    export class JoseDriver extends jose.JoseDriver {}
}

declare module "passport-jwt/platform-jsonwebtoken" {
    export class JsonWebTokenDriver extends jsonwebtoken.JsonWebTokenDriver {}
}

declare module "passport-jwt/platform-nestjsjwt" {
    export class NestjsJwtDriver extends nestjsjwt.NestJsJwtDriver {}
}
