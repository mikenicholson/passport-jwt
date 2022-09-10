import { DefaultPayload, JwtStrategy, JwtStrategyOptionsBase, ProviderOrValue, VerifyCallback, BasicVerifyCallback } from "../jwt_strategy";
import { JsonWebTokenDriver } from "../platforms/jsonwebtoken";
import { VerifyOptions, Algorithm } from "jsonwebtoken";
interface LegacyOptions {
    audience?: string;
    issuer?: string;
    algorithms?: Algorithm[];
    ignoreExpiration?: boolean;
    jsonWebTokenOptions?: VerifyOptions;
}
declare type JwtAutoStrategyOptions = Omit<JwtStrategyOptionsBase<string>, "jwtDriver"> & ProviderOrValue<string> & LegacyOptions;
declare class JwtAutoStrategy<Payload extends DefaultPayload = DefaultPayload, Verify extends BasicVerifyCallback = VerifyCallback<Payload>> extends JwtStrategy<Payload, Verify, string> {
    static OverrideAutoDriver: typeof JsonWebTokenDriver;
    protected static ignoreLegacy: boolean;
    constructor(extOptions: JwtAutoStrategyOptions, verify: Verify);
}
export { JwtAutoStrategy as Strategy, JwtAutoStrategyOptions };
