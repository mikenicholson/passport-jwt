"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWebTokenDriver = void 0;
var tslib_1 = require("tslib");
var base_1 = require("./base");
var JsonWebTokenDriver = /** @class */ (function (_super) {
    tslib_1.__extends(JsonWebTokenDriver, _super);
    function JsonWebTokenDriver(driver, options) {
        var _this = this;
        if (typeof driver !== "object" || !("verify" in driver) || typeof driver["verify"] !== "function") {
            throw new TypeError("A none 'jsonwebtoken' compatible core has been passed.");
        }
        _this = _super.call(this) || this;
        _this.driver = driver;
        _this.options = options;
        _this.defaultOptions = { algorithms: ["HS256"] };
        return _this;
    }
    JsonWebTokenDriver.prototype.validate = function (token, keyOrSecret) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, validation;
            return tslib_1.__generator(this, function (_a) {
                result = { success: false, message: undefined };
                try {
                    validation = this.driver.verify(token, keyOrSecret, this.getOptions());
                    result.success = true;
                    result.payload = validation;
                }
                catch (err) {
                    result.message = err.message;
                }
                return [2 /*return*/, result];
            });
        });
    };
    return JsonWebTokenDriver;
}(base_1.JwtDriver));
exports.JsonWebTokenDriver = JsonWebTokenDriver;
