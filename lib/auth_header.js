
var re = /(\S+)\s+(\S+)/

function parseAuthHeader(hdrValue) {
    if (typeof hdrValue !== 'string') {
        return null;
    }

    matches = hdrValue.match(re);

    if (matches) {
        return matches && { scheme: matches[1], value: matches[2] };
    }

    return { scheme: 'JWT', value: hdrValue };

}

module.exports = {
    parse: parseAuthHeader
};
