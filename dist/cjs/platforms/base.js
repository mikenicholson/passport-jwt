"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtDriver = void 0;
var tslib_1 = require("tslib");
var JwtDriver = /** @class */ (function () {
    function JwtDriver() {
    }
    JwtDriver.prototype.getOptions = function () {
        return tslib_1.__assign(tslib_1.__assign({}, this.defaultOptions), this.options);
    };
    return JwtDriver;
}());
exports.JwtDriver = JwtDriver;
