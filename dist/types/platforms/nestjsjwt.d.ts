import { DefaultPayload, JwtProvidedDriver, JwtResult } from "./base";
import type { JwtVerifyOptions, JwtService } from "@nestjs/jwt";
declare type NestJsJwtDriverCore = {
    verifyAsync: JwtService["verifyAsync"];
};
export declare class NestJsJwtDriver extends JwtProvidedDriver<NestJsJwtDriverCore, JwtVerifyOptions> {
    protected defaultOptions: JwtVerifyOptions;
    constructor(core: NestJsJwtDriverCore, options?: JwtVerifyOptions);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret?: string): Promise<JwtResult<Payload>>;
}
export {};
