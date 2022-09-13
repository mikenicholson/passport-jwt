"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonWebTokenDriver = void 0;

var tslib_1 = require("tslib");

var base_1 = require("./base.cjs");

var error_messages_1 = require("../error_messages.cjs");

var JsonWebTokenDriver =
/** @class */
function (_super) {
  tslib_1.__extends(JsonWebTokenDriver, _super);

  function JsonWebTokenDriver(core, options) {
    var _this = this;

    if (typeof core !== "object" || !("verify" in core) || typeof core["verify"] !== "function") {
      throw new TypeError(error_messages_1.ErrorMessages.JWT_CORE_INCOMPATIBLE);
    }

    _this = _super.call(this, core, options) || this;
    _this.defaultOptions = {
      algorithms: ["HS256"]
    };
    return _this;
  }

  JsonWebTokenDriver.prototype.validate = function (token, keyOrSecret) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var result, validation;
      return tslib_1.__generator(this, function (_a) {
        result = {
          success: false,
          message: undefined
        };

        try {
          validation = this.core.verify(token, keyOrSecret, this.getOptions());
          result.success = true;
          result.payload = validation;
        } catch (err) {
          result.message = err === null || err === void 0 ? void 0 : err.message;
        }

        return [2
        /*return*/
        , result];
      });
    });
  };

  return JsonWebTokenDriver;
}(base_1.JwtDriver);

exports.JsonWebTokenDriver = JsonWebTokenDriver;
//# sourceMappingURL=jsonwebtoken.cjs.map
