import {DefaultPayload, JwtStrategy, JwtStrategyOptionsBase, ProviderOrValue, VerifyCallback, BasicVerifyCallback} from "../jwt_strategy";
import {JsonWebTokenDriver} from "../platforms/jsonwebtoken";
import jsonwebtoken, {VerifyOptions, Algorithm} from "jsonwebtoken";

interface LegacyOptions {
    audience?: string,
    issuer?: string,
    algorithms?: Algorithm[],
    ignoreExpiration?: boolean,
    jsonWebTokenOptions?: VerifyOptions
}

type JwtAutoStrategyOptions =
    Omit<JwtStrategyOptionsBase<string>, "jwtDriver">
    & ProviderOrValue<string>
    & LegacyOptions;

class JwtAutoStrategy<Payload extends DefaultPayload = DefaultPayload,
    Verify extends BasicVerifyCallback = VerifyCallback<Payload>> extends JwtStrategy<Payload, Verify, string> {

    /* to override the auto driver, mainly used for testing */
    public static OverrideAutoDriver = JsonWebTokenDriver;
    protected static override ignoreLegacy = true;

    constructor(
        extOptions: JwtAutoStrategyOptions,
        verify: Verify
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

export {JwtAutoStrategy as Strategy, JwtAutoStrategyOptions};