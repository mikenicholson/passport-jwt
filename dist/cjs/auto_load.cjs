"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Strategy = void 0;

var tslib_1 = require("tslib");

var jwt_strategy_1 = require("./jwt_strategy.cjs");

var jsonwebtoken_1 = require("./platforms/jsonwebtoken.cjs");

var jsonwebtoken_2 = tslib_1.__importDefault(require("jsonwebtoken"));

var JwtAutoStrategy =
/** @class */
function (_super) {
  tslib_1.__extends(JwtAutoStrategy, _super);

  function JwtAutoStrategy(extOptions, verify) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;

    var driverOptions = tslib_1.__assign(tslib_1.__assign({}, (_a = extOptions.jsonWebTokenOptions) !== null && _a !== void 0 ? _a : {}), {
      issuer: (_b = extOptions.issuer) !== null && _b !== void 0 ? _b : (_c = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _c === void 0 ? void 0 : _c.issuer,
      algorithms: (_d = extOptions.algorithms) !== null && _d !== void 0 ? _d : (_e = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _e === void 0 ? void 0 : _e.algorithms,
      ignoreExpiration: (_f = extOptions.ignoreExpiration) !== null && _f !== void 0 ? _f : (_g = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _g === void 0 ? void 0 : _g.ignoreExpiration,
      audience: (_h = extOptions.audience) !== null && _h !== void 0 ? _h : (_j = extOptions === null || extOptions === void 0 ? void 0 : extOptions.jsonWebTokenOptions) === null || _j === void 0 ? void 0 : _j.audience
    });

    return _super.call(this, tslib_1.__assign({
      jwtDriver: new JwtAutoStrategy.OverrideAutoDriver(jsonwebtoken_2.default, driverOptions)
    }, extOptions), verify) || this;
  }
  /* to override the auto driver, mainly used for testing */


  JwtAutoStrategy.OverrideAutoDriver = jsonwebtoken_1.JsonWebTokenDriver;
  JwtAutoStrategy.ignoreLegacy = true;
  return JwtAutoStrategy;
}(jwt_strategy_1.JwtStrategy);

exports.Strategy = JwtAutoStrategy;
//# sourceMappingURL=auto_load.cjs.map
