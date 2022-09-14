import * as auto from "./dist/types/auto_load";
import * as strategy from "./dist/types/jwt_strategy";

declare module "passport-jwt/auto" {
    export class Strategy<Payload = string, Request extends boolean = false, Verify extends strategy.BasicVerifyCallback<Payload, Request> = strategy.BasicVerifyCallback<Payload, Request>> extends auto.Strategy<Payload, Request, Verify> {}
    export type JwtAutoStrategyOptions<Request extends boolean = boolean> = auto.JwtAutoStrategyOptions<Request>;
}
