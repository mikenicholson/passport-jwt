import * as jose from "./dist/types/platforms/jose";

declare module "passport-jwt/platform-jose" {
    export class JoseDriver extends jose.JoseDriver {}
}