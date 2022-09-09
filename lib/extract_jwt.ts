import {parse} from "url";
import {parseAuthHeader} from "./auth_header";
import type {Request} from "express";

// Note: express http converts all headers
// to lower case.
enum SchemaType {
    AUTH_HEADER = "authorization",
    BEARER_AUTH_SCHEME = 'bearer'
}

export type JwtExtractor = (request: Request) => string | null | Promise<string | null>;

export class ExtractJwt {

    public static fromSignedCookie(name: string): JwtExtractor {
        return (request) => {
            let token = null;
            if (request.signedCookies && name in request.signedCookies && typeof request.signedCookies[name] === "string") {
                token = request.signedCookies[name];
            }
            return token;
        }
    };

    public static fromSessionKey(name: string): JwtExtractor {
        return (request: any) => {
            let token = null;
            if (request.session && name in request.session && typeof request.session[name] === "string") {
                token = request.session[name];
            }
            return token;
        }
    }

    public static fromCookie(name: string): JwtExtractor {
        return (request: Request) => {
            let token = null;
            if (request.cookies && name in request.cookies && typeof request.cookies[name] === "string") {
                token = request.cookies[name];
            }
            return token;
        }
    }

    public static fromRequestProperty(property: string): JwtExtractor {
        return (request) => {
            let token = null;
            if (property in request && typeof request[property] === "string") {
                token = request[property];
            }
            return token;
        }
    }

    public static fromHeader(header_name: string): JwtExtractor {
        return (request) => {
            let token = null;
            if (request.headers && header_name in request.headers && typeof request.headers[header_name] === "string") {
                token = request.headers[header_name] as string;
            }
            return token;
        };
    }


    public static fromBodyField(field_name: string): JwtExtractor {

        return (request) => {
            let token = null;
            if (request.body && field_name in request.body) {
                token = request.body[field_name];
            }
            return token;
        };
    };

    public static fromUrlQueryParameter(param_name: string): JwtExtractor {
        return (request) => {
            let token = null;
            const parsed_url = parse(request.url, true);
            if (parsed_url.query && param_name in parsed_url.query && typeof parsed_url.query[param_name] === "string") {
                token = parsed_url.query[param_name] as string;
            }
            return token;
        };
    };

    public static fromAuthHeaderWithScheme(auth_scheme: string): JwtExtractor {
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
    };

    public static fromAuthHeaderAsBearerToken(): JwtExtractor {
        return this.fromAuthHeaderWithScheme(SchemaType.BEARER_AUTH_SCHEME);
    };

    public static fromExtractors(extractors: JwtExtractor[]): JwtExtractor {
        if (!Array.isArray(extractors)) {
            throw new TypeError('extractors.fromExtractors expects an array')
        }

        return async (request) => {
            let token = null;
            for (const extractor of extractors) {
                token = await extractor(request);
                if (token) break;
            }
            return token;
        }
    };
}