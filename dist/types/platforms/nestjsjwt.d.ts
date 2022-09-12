import { DefaultPayload, JwtProvidedDriver, JwtResult } from "./base";
import type { JwtVerifyOptions, JwtService } from "@nestjs/jwt";
declare type NestJsJwtDriverType = {
    verifyAsync: JwtService["verifyAsync"];
};
export declare class NestJsJwtDriver extends JwtProvidedDriver<NestJsJwtDriverType, JwtVerifyOptions> {
    readonly driver: NestJsJwtDriverType;
    protected readonly options?: JwtVerifyOptions | undefined;
    protected defaultOptions: JwtVerifyOptions;
    constructor(driver: NestJsJwtDriverType, options?: JwtVerifyOptions | undefined);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret?: string): Promise<JwtResult<Payload>>;
}
export {};
