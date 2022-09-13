import * as nestjsjwt from "./dist/types/platforms/nestjsjwt";

declare module "passport-jwt/platform-nestjsjwt" {
    export class NestJsJwtDriver extends nestjsjwt.NestJsJwtDriver {}
}
