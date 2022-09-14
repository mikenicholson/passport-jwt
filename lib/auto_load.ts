import {
    JwtStrategy,
    JwtStrategyOptionsBase,
    UnifiedVerifyCallback,
    JwtStrategyOptions,
    ProviderOrValueBase
} from "./jwt_strategy";
import {JsonWebTokenDriver} from "./platforms/jsonwebtoken";
import jsonwebtoken, {VerifyOptions, Algorithm} from "jsonwebtoken";
import type {DefaultPayload} from "./platforms/base";

interface LegacyOptions {
    audience?: string;
    issuer?: string;
    algorithms?: Algorithm[];
    ignoreExpiration?: boolean;
    jsonWebTokenOptions?: VerifyOptions;
    jwtDriver?: undefined;
}

type JwtAutoStrategyOptions<Request extends boolean = boolean> =
    ProviderOrValueBase<string, "jwtDriver">
    & JwtStrategyOptionsBase<Request>
    & LegacyOptions;

class JwtAutoStrategy<Payload extends DefaultPayload = DefaultPayload,
    Request extends boolean = false> extends JwtStrategy<Payload, string, Request> {

    /* to override the auto driver, mainly used for testing */
    public static OverrideAutoDriver = JsonWebTokenDriver;
    protected static override ignoreLegacy = true;

    constructor(
        extOptions: JwtAutoStrategyOptions,
        verify: UnifiedVerifyCallback<Payload, Request>
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
        } as JwtStrategyOptions<string, Request>, verify);
    }
}

export {JwtAutoStrategy as Strategy, JwtAutoStrategyOptions};
