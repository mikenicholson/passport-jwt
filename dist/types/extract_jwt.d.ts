import type { Request } from "express";
export declare type JwtExtractor = (request: Request) => string | null | Promise<string | null>;
export declare class ExtractJwt {
    static fromSignedCookie(name: string): JwtExtractor;
    static fromSessionKey(name: string): JwtExtractor;
    static fromCookie(name: string): JwtExtractor;
    static fromRequestProperty(property: string): JwtExtractor;
    static fromHeader(header_name: string): JwtExtractor;
    static fromBodyField(field_name: string): JwtExtractor;
    static fromUrlQueryParameter(param_name: string): JwtExtractor;
    static fromAuthHeaderWithScheme(auth_scheme: string): JwtExtractor;
    static fromAuthHeaderAsBearerToken(): JwtExtractor;
    static fromExtractors(extractors: JwtExtractor[]): JwtExtractor;
}
