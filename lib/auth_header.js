
var re = /(\S+)\s+(\S+)/

function parseAuthHeader(hdrValue) { 
    if (!typeof hdrValue === 'string') {
        return null;
    }

    matches = hdrValue.match(re);
    return { scheme: matches[1], value: matches[2] }
}

module.exports = {
    parse: parseAuthHeader
};
