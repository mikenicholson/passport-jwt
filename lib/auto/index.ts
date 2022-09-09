import {JwtStrategy, JwtStrategyOptionsBase, ProviderOrValue, VerifyCallback} from "../jwt_strategy";
import {JsonWebTokenDriver} from "../platforms/jsonwebtoken";
import jsonwebtoken, {VerifyOptions, Algorithm} from "jsonwebtoken";

interface LegacyOptions {
    audience?: string,
    issuer?: string,
    algorithms?: Algorithm[],
    ignoreExpiration?: boolean,
    jsonWebTokenOptions?: VerifyOptions
}

export type JwtAutoStrategyOptions = Omit<JwtStrategyOptionsBase, "jwtDriver"> & ProviderOrValue & LegacyOptions;

class JwtAutoStrategy<T extends Record<string, any>> extends JwtStrategy<T> {

    /* to override the auto driver, mainly used for testing */
    public static OverrideAutoDriver = JsonWebTokenDriver;
    protected static override ignoreLegacy = true;

    constructor(
        extOptions: JwtAutoStrategyOptions,
        verify: VerifyCallback<T>
    ) {
        const driverOptions = {
            ...(extOptions.jsonWebTokenOptions ?? {}),
            ...{
                issuer: extOptions.issuer ?? extOptions?.jsonWebTokenOptions?.issuer,
                algorithms: extOptions.algorithms ?? extOptions?.jsonWebTokenOptions?.algorithms,
                ignoreExpiration: extOptions.ignoreExpiration ?? extOptions?.jsonWebTokenOptions?.ignoreExpiration,
                audience: extOptions.audience ?? extOptions?.jsonWebTokenOptions?.audience,
            }
        };
        super({
            jwtDriver: new JwtAutoStrategy.OverrideAutoDriver(jsonwebtoken, driverOptions),
            ...extOptions,
        }, verify);
    }
}

export {JwtAutoStrategy as Strategy};