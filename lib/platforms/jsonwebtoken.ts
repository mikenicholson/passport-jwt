import {DefaultPayload, JwtDriver, JwtResult, JwtResultInternal} from "./base";
import type {VerifyOptions, verify, JwtPayload} from "jsonwebtoken";
import { ErrorMessages } from "../error_messages";

type JsonWebTokenDriverCore = { verify: typeof verify };

export class JsonWebTokenDriver extends JwtDriver<JsonWebTokenDriverCore, VerifyOptions, string> {
    protected defaultOptions: VerifyOptions = {algorithms: ["HS256"]};

    constructor(
        core: JsonWebTokenDriverCore,
        options?: VerifyOptions
    ) {
        if(typeof core !== "object" || !("verify" in core) || typeof core["verify"] !== "function") {
            throw new TypeError(ErrorMessages.JWT_CORE_INCOMPATIBLE);
        }
        super(core, options);
    }


    public async validate<Payload extends DefaultPayload> (token: string, keyOrSecret: string): Promise<JwtResult<Payload>> {
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = this.core.verify(token, keyOrSecret, this.getOptions());
            result.success = true;
            result.payload = validation as JwtPayload;
        } catch (err: any) {
            result.message = err?.message;
        }
        return result as JwtResult<Payload>;
    }

}