import { JwtStrategy } from "../jwt_strategy";
import { JsonWebTokenDriver } from "../platforms/jsonwebtoken";
import jsonwebtoken from "jsonwebtoken";
class JwtAutoStrategy extends JwtStrategy {
    constructor(extOptions, verify) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const driverOptions = Object.assign(Object.assign({}, ((_a = extOptions.jsonWebTokenOptions) !== null && _a !== void 0 ? _a : {})), {
            issuer: (_b = extOptions.issuer) !== null && _b !== void 0 ? _b : (_c = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _c === void 0 ? void 0 : _c.issuer,
            algorithms: (_d = extOptions.algorithms) !== null && _d !== void 0 ? _d : (_e = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _e === void 0 ? void 0 : _e.algorithms,
            ignoreExpiration: (_f = extOptions.ignoreExpiration) !== null && _f !== void 0 ? _f : (_g = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _g === void 0 ? void 0 : _g.ignoreExpiration,
            audience: (_h = extOptions.audience) !== null && _h !== void 0 ? _h : (_j = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _j === void 0 ? void 0 : _j.audience,
        });
        super(Object.assign({ jwtDriver: new JwtAutoStrategy.OverrideAutoDriver(jsonwebtoken, driverOptions) }, extOptions), verify);
    }
}
/* to override the auto driver, mainly used for testing */
JwtAutoStrategy.OverrideAutoDriver = JsonWebTokenDriver;
JwtAutoStrategy.ignoreLegacy = true;
export { JwtAutoStrategy as Strategy };
//# sourceMappingURL=index.js.map