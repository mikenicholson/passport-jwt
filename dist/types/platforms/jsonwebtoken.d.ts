import { DefaultPayload, JwtDriver, JwtResult } from "./base";
import type { VerifyOptions, verify } from "jsonwebtoken";
declare type JsonWebTokenDriverType = {
    verify: typeof verify;
};
export declare class JsonWebTokenDriver extends JwtDriver<JsonWebTokenDriverType, VerifyOptions, string> {
    protected defaultOptions: VerifyOptions;
    constructor(core: JsonWebTokenDriverType, options?: VerifyOptions);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret: string): Promise<JwtResult<Payload>>;
}
export {};
