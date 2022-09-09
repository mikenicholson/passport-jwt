import { JwtStrategy, JwtStrategyOptionsBase, ProviderOrValue, VerifyCallback } from "../jwt_strategy";
import { JsonWebTokenDriver } from "../platforms/jsonwebtoken";
import { VerifyOptions, Algorithm } from "jsonwebtoken";
interface LegacyOptions {
    audience?: string;
    issuer?: string;
    algorithms?: Algorithm[];
    ignoreExpiration?: boolean;
    jsonWebTokenOptions?: VerifyOptions;
}
export declare type JwtAutoStrategyOptions = Omit<JwtStrategyOptionsBase, "jwtDriver"> & ProviderOrValue & LegacyOptions;
declare class JwtAutoStrategy<T extends Record<string, any>> extends JwtStrategy<T> {
    static OverrideAutoDriver: typeof JsonWebTokenDriver;
    protected static ignoreLegacy: boolean;
    constructor(extOptions: JwtAutoStrategyOptions, verify: VerifyCallback<T>);
}
export { JwtAutoStrategy as Strategy };
