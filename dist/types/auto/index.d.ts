import { JwtStrategy, JwtStrategyOptionsBase, VerifyCallback, BasicVerifyCallback, ProviderOrValueBase } from "../jwt_strategy";
import { JsonWebTokenDriver } from "../platforms/jsonwebtoken";
import { VerifyOptions, Algorithm } from "jsonwebtoken";
import type { DefaultPayload } from "../platforms/base";
interface LegacyOptions {
    audience?: string;
    issuer?: string;
    algorithms?: Algorithm[];
    ignoreExpiration?: boolean;
    jsonWebTokenOptions?: VerifyOptions;
    jwtDriver?: undefined;
}
declare type JwtAutoStrategyOptions = ProviderOrValueBase<string, "jwtDriver"> & JwtStrategyOptionsBase & LegacyOptions;
declare class JwtAutoStrategy<Payload extends DefaultPayload = DefaultPayload, Verify extends BasicVerifyCallback = VerifyCallback<Payload>> extends JwtStrategy<Payload, Verify> {
    static OverrideAutoDriver: typeof JsonWebTokenDriver;
    protected static ignoreLegacy: boolean;
    constructor(extOptions: JwtAutoStrategyOptions, verify: Verify);
}
export { JwtAutoStrategy as Strategy, JwtAutoStrategyOptions };
