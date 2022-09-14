import { DefaultPayload, JwtDriver, JwtResult } from "./base";
import type { VerifyOptions, verify } from "jsonwebtoken";
declare type JsonWebTokenDriverCore = {
    verify: typeof verify;
};
export declare class JsonWebTokenDriver extends JwtDriver<JsonWebTokenDriverCore, VerifyOptions, string> {
    protected defaultOptions: VerifyOptions;
    constructor(core: JsonWebTokenDriverCore, options?: VerifyOptions);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret: string): Promise<JwtResult<Payload>>;
}
export {};
