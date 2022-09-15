import type { Request } from "express";
export declare type JwtFromRequestFunction = (request: Request) => string | null | Promise<string | null>;
export declare class ExtractJwt {
    static fromSignedCookie(name: string): JwtFromRequestFunction;
    static fromSessionKey(name: string): JwtFromRequestFunction;
    static fromCookie(name: string): JwtFromRequestFunction;
    static fromRequestProperty(property: string): JwtFromRequestFunction;
    static fromHeader(header_name: string): JwtFromRequestFunction;
    static fromBodyField(field_name: string): JwtFromRequestFunction;
    static fromUrlQueryParameter(param_name: string): JwtFromRequestFunction;
    static fromAuthHeaderWithScheme(auth_scheme: string): JwtFromRequestFunction;
    static fromAuthHeaderAsBearerToken(): JwtFromRequestFunction;
    static fromExtractors(extractors: JwtFromRequestFunction[]): JwtFromRequestFunction;
}
