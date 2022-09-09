import { __awaiter } from "tslib";
import { parse } from "url";
import { parseAuthHeader } from "./auth_header";
// Note: express http converts all headers
// to lower case.
var SchemaType;
(function (SchemaType) {
    SchemaType["AUTH_HEADER"] = "authorization";
    SchemaType["BEARER_AUTH_SCHEME"] = "bearer";
})(SchemaType || (SchemaType = {}));
export class ExtractJwt {
    static fromSignedCookie(name) {
        return (request) => {
            let token = null;
            if (request.signedCookies && name in request.signedCookies && typeof request.signedCookies[name] === "string") {
                token = request.signedCookies[name];
            }
            return token;
        };
    }
    ;
    static fromSessionKey(name) {
        return (request) => {
            let token = null;
            if (request.session && name in request.session && typeof request.session[name] === "string") {
                token = request.session[name];
            }
            return token;
        };
    }
    static fromCookie(name) {
        return (request) => {
            let token = null;
            if (request.cookies && name in request.cookies && typeof request.cookies[name] === "string") {
                token = request.cookies[name];
            }
            return token;
        };
    }
    static fromRequestProperty(property) {
        return (request) => {
            let token = null;
            if (property in request && typeof request[property] === "string") {
                token = request[property];
            }
            return token;
        };
    }
    static fromHeader(header_name) {
        return (request) => {
            let token = null;
            if (request.headers && header_name in request.headers && typeof request.headers[header_name] === "string") {
                token = request.headers[header_name];
            }
            return token;
        };
    }
    static fromBodyField(field_name) {
        return (request) => {
            let token = null;
            if (request.body && field_name in request.body) {
                token = request.body[field_name];
            }
            return token;
        };
    }
    ;
    static fromUrlQueryParameter(param_name) {
        return (request) => {
            let token = null;
            const parsed_url = parse(request.url, true);
            if (parsed_url.query && param_name in parsed_url.query && typeof parsed_url.query[param_name] === "string") {
                token = parsed_url.query[param_name];
            }
            return token;
        };
    }
    ;
    static fromAuthHeaderWithScheme(auth_scheme) {
        const auth_scheme_lower = auth_scheme.toLowerCase();
        return (request) => {
            let token = null;
            if (request.headers && SchemaType.AUTH_HEADER in request.headers) {
                const auth_params = parseAuthHeader(request.headers[SchemaType.AUTH_HEADER]);
                if (auth_params && auth_scheme_lower === auth_params.scheme.toLowerCase()) {
                    token = auth_params.value;
                }
            }
            return token;
        };
    }
    ;
    static fromAuthHeaderAsBearerToken() {
        return this.fromAuthHeaderWithScheme(SchemaType.BEARER_AUTH_SCHEME);
    }
    ;
    static fromExtractors(extractors) {
        if (!Array.isArray(extractors)) {
            throw new TypeError('extractors.fromExtractors expects an array');
        }
        return (request) => __awaiter(this, void 0, void 0, function* () {
            let token = null;
            for (const extractor of extractors) {
                token = yield extractor(request);
                if (token)
                    break;
            }
            return token;
        });
    }
    ;
}
