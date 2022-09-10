"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuthHeader = void 0;
var HdrRegex = /(\S+)\s+(\S+)/;
function parseAuthHeader(hdrValue) {
    if (typeof hdrValue !== 'string') {
        return null;
    }
    var matches = hdrValue.match(HdrRegex);
    return matches && { scheme: matches[1], value: matches[2] };
}
exports.parseAuthHeader = parseAuthHeader;
