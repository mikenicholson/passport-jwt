import * as auto from "./dist/types/auto_load";
import * as strategy from "./dist/types/jwt_strategy";

declare module "passport-jwt/auto" {
    export class Strategy<Payload = string, Request extends boolean = false> extends auto.Strategy<Payload, Request> {}
    export type JwtAutoStrategyOptions<Request extends boolean = boolean> = auto.JwtAutoStrategyOptions<Request>;
}
