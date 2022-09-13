import * as jsonwebtoken from "./dist/types/platforms/jsonwebtoken";

declare module "passport-jwt/platform-jsonwebtoken" {
    export class JsonWebTokenDriver extends jsonwebtoken.JsonWebTokenDriver {}
}
