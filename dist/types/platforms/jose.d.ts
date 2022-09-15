import { DefaultPayload, JwtDriver, JwtResult } from "./base";
import type { VerifyOptions, jwtVerify, KeyLike } from "jose";
declare type JoseDriverCore = {
    jwtVerify: typeof jwtVerify;
};
export declare class JoseDriver extends JwtDriver<JoseDriverCore, VerifyOptions, KeyLike | string> {
    protected defaultOptions: VerifyOptions;
    constructor(core: JoseDriverCore, options?: VerifyOptions);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret: string | KeyLike): Promise<JwtResult<Payload>>;
}
export {};
