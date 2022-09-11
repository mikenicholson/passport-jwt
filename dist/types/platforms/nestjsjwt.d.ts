import { JwtProvidedDriver, JwtResult } from "./base";
import type { JwtVerifyOptions, JwtService } from "@nestjs/jwt";
declare type NestJsJwtDriverType = {
    verify: JwtService["verify"];
};
export declare class NestJsJwtDriver extends JwtProvidedDriver<NestJsJwtDriverType, JwtVerifyOptions> {
    readonly driver: NestJsJwtDriverType;
    protected readonly options?: JwtVerifyOptions | undefined;
    protected defaultOptions: JwtVerifyOptions;
    constructor(driver: NestJsJwtDriverType, options?: JwtVerifyOptions | undefined);
    validate<T extends Record<string, any>>(token: string, keyOrSecret?: string): Promise<JwtResult<T>>;
}
export {};
