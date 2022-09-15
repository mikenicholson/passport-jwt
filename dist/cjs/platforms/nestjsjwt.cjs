"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NestJsJwtDriver = void 0;

var tslib_1 = require("tslib");

var base_1 = require("./base.cjs");

var error_messages_1 = require("../error_messages.cjs");

var NestJsJwtDriver =
/** @class */
function (_super) {
  tslib_1.__extends(NestJsJwtDriver, _super);

  function NestJsJwtDriver(core, options) {
    var _this = this;

    if (typeof core !== "object" || !("verifyAsync" in core) || typeof core["verifyAsync"] !== "function") {
      throw new TypeError(error_messages_1.ErrorMessages.NEST_CORE_INCOMPATIBLE);
    }

    _this = _super.call(this, core, options) || this;
    _this.defaultOptions = {
      algorithms: ["HS256"]
    };
    return _this;
  }

  NestJsJwtDriver.prototype.validate = function (token, keyOrSecret) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
      var result, validation, err_1;
      return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            result = {
              success: false,
              message: undefined
            };
            _a.label = 1;

          case 1:
            _a.trys.push([1, 3,, 4]);

            return [4
            /*yield*/
            , this.core.verifyAsync(token, this.getOptions())];

          case 2:
            validation = _a.sent();
            result.success = true;
            result.payload = validation;
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

  return NestJsJwtDriver;
}(base_1.JwtProvidedDriver);

exports.NestJsJwtDriver = NestJsJwtDriver;
//# sourceMappingURL=nestjsjwt.cjs.map
