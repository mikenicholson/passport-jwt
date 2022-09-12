import { DefaultPayload, JwtDriver, JwtResult } from "./base";
import type { VerifyOptions, verify } from "jsonwebtoken";
declare type JsonWebTokenDriverType = {
    verify: typeof verify;
};
export declare class JsonWebTokenDriver extends JwtDriver<JsonWebTokenDriverType, VerifyOptions, string> {
    readonly driver: JsonWebTokenDriverType;
    protected readonly options?: VerifyOptions | undefined;
    protected defaultOptions: VerifyOptions;
    constructor(driver: JsonWebTokenDriverType, options?: VerifyOptions | undefined);
    validate<Payload extends DefaultPayload>(token: string, keyOrSecret: string): Promise<JwtResult<Payload>>;
}
export {};
