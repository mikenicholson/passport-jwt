"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtProvidedDriver = exports.JwtDriver = void 0;
var tslib_1 = require("tslib");
var JwtDriver = /** @class */ (function () {
    function JwtDriver() {
        this.keyIsProvidedByMe = false;
    }
    JwtDriver.prototype.getOptions = function () {
        return tslib_1.__assign(tslib_1.__assign({}, this.defaultOptions), this.options);
    };
    return JwtDriver;
}());
exports.JwtDriver = JwtDriver;
var JwtProvidedDriver = /** @class */ (function (_super) {
    tslib_1.__extends(JwtProvidedDriver, _super);
    function JwtProvidedDriver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.keyIsProvidedByMe = true;
        return _this;
    }
    return JwtProvidedDriver;
}(JwtDriver));
exports.JwtProvidedDriver = JwtProvidedDriver;
