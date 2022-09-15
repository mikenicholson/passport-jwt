import { JwtStrategy, JwtStrategyOptionsBase, UnifiedVerifyCallback, ProviderOrValueBase } from "./jwt_strategy";
import { JsonWebTokenDriver } from "./platforms/jsonwebtoken";
import { VerifyOptions, Algorithm } from "jsonwebtoken";
import type { DefaultPayload } from "./platforms/base";
interface LegacyOptions {
    audience?: string;
    issuer?: string;
    algorithms?: Algorithm[];
    ignoreExpiration?: boolean;
    jsonWebTokenOptions?: VerifyOptions;
    jwtDriver?: undefined;
}
declare type JwtAutoStrategyOptions<Request extends boolean = boolean> = ProviderOrValueBase<string, "jwtDriver"> & JwtStrategyOptionsBase<Request> & LegacyOptions;
declare class JwtAutoStrategy<Payload extends DefaultPayload = DefaultPayload, Request extends boolean = false> extends JwtStrategy<Payload, string, Request> {
    static OverrideAutoDriver: typeof JsonWebTokenDriver;
    protected static ignoreLegacy: boolean;
    constructor(extOptions: JwtAutoStrategyOptions, verify: UnifiedVerifyCallback<Payload, Request>);
}
export { JwtAutoStrategy as Strategy, JwtAutoStrategyOptions };
