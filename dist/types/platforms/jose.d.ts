import { DefaultPayload, JwtDriver, JwtResult } from "./base";
import type { VerifyOptions, jwtVerify, KeyLike } from "jose";
declare type JoseDriverType = {
    jwtVerify: typeof jwtVerify;
};
export declare class JoseDriver extends JwtDriver<JoseDriverType, VerifyOptions, KeyLike | string> {
    protected defaultOptions: VerifyOptions;
    constructor(core: JoseDriverType, options?: VerifyOptions);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret: string | KeyLike): Promise<JwtResult<Payload>>;
}
export {};
