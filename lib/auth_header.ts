const HdrRegex = /(\S+)\s+(\S+)/;

export function parseAuthHeader(hdrValue?: string) {
    if (typeof hdrValue !== 'string') {
        return null;
    }
    const matches = hdrValue.match(HdrRegex);
    return matches && { scheme: matches[1], value: matches[2] };
}
