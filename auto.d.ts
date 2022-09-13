import * as auto from "./dist/types/auto/index";
import * as strategy from "./dist/types/jwt_strategy";

declare module "passport-jwt/auto" {
    export class Strategy<Payload = string, Verify extends strategy.BasicVerifyCallback = strategy.VerifyCallback<Payload>> extends auto.Strategy<Payload, Verify> {}
    export type JwtAutoStrategyOptions = auto.JwtAutoStrategyOptions;
}