import { JwtDriver, JwtResult } from "./base";
import type { VerifyOptions, jwtVerify, KeyLike } from "jose";
declare type JoseDriverType = {
    jwtVerify: typeof jwtVerify;
};
export declare class JoseDriver extends JwtDriver<JoseDriverType, VerifyOptions, KeyLike | string> {
    readonly driver: JoseDriverType;
    protected readonly options?: VerifyOptions | undefined;
    protected defaultOptions: VerifyOptions;
    constructor(driver: JoseDriverType, options?: VerifyOptions | undefined);
    validate<T extends Record<string, any>>(token: string, keyOrSecret: string | KeyLike): Promise<JwtResult<T>>;
}
export {};
