import { DefaultPayload, JwtProvidedDriver, JwtResult } from "./base";
import type { JwtVerifyOptions, JwtService } from "@nestjs/jwt";
declare type NestJsJwtDriverType = {
    verifyAsync: JwtService["verifyAsync"];
};
export declare class NestJsJwtDriver extends JwtProvidedDriver<NestJsJwtDriverType, JwtVerifyOptions> {
    protected defaultOptions: JwtVerifyOptions;
    constructor(core: NestJsJwtDriverType, options?: JwtVerifyOptions);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret?: string): Promise<JwtResult<Payload>>;
}
export {};
