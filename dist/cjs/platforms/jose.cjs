"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JoseDriver = void 0;

var tslib_1 = require("tslib");

var base_1 = require("./base.cjs");

var crypto_1 = require("crypto");

var error_messages_1 = require("../error_messages.cjs");

var JoseDriver =
/** @class */
function (_super) {
  tslib_1.__extends(JoseDriver, _super);

  function JoseDriver(core, options) {
    var _this = this;

    if (typeof core !== "object" || !("jwtVerify" in core) || typeof core["jwtVerify"] !== "function") {
      throw new TypeError(error_messages_1.ErrorMessages.JOSE_CORE_INCOMPATIBLE);
    }

    _this = _super.call(this, core, options) || this;
    _this.defaultOptions = {
      algorithms: ["HS256"]
    };
    return _this;
  }

  JoseDriver.prototype.validate = function (token, keyOrSecret) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var jwk, result, validation, err_1;
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            jwk = undefined;

            if (typeof keyOrSecret === "string") {
              jwk = (0, crypto_1.createSecretKey)(Buffer.from(keyOrSecret));
            } else {
              jwk = keyOrSecret;
            }

            result = {
              success: false,
              message: undefined
            };
            _a.label = 1;

          case 1:
            _a.trys.push([1, 3,, 4]);

            return [4
            /*yield*/
            , this.core.jwtVerify(token, jwk, this.getOptions())];

          case 2:
            validation = _a.sent();
            result.success = true;
            result.payload = validation.payload;
            return [3
            /*break*/
            , 4];

          case 3:
            err_1 = _a.sent();
            result.message = err_1 === null || err_1 === void 0 ? void 0 : err_1.message;
            return [3
            /*break*/
            , 4];

          case 4:
            return [2
            /*return*/
            , result];
        }
      });
    });
  };

  return JoseDriver;
}(base_1.JwtDriver);

exports.JoseDriver = JoseDriver;
//# sourceMappingURL=jose.cjs.map
