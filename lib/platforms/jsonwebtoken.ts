import {DefaultPayload, JwtDriver, JwtResult, JwtResultInternal} from "./base";
import type {VerifyOptions, verify, JwtPayload} from "jsonwebtoken";
import { ErrorMessages } from "../error_messages";

type JsonWebTokenDriverType = { verify: typeof verify };

export class JsonWebTokenDriver extends JwtDriver<JsonWebTokenDriverType, VerifyOptions, string> {
    protected defaultOptions: VerifyOptions = {algorithms: ["HS256"]};

    constructor(
        public readonly driver: JsonWebTokenDriverType,
        protected readonly options?: VerifyOptions
    ) {
        if(typeof driver !== "object" || !("verify" in driver) || typeof driver["verify"] !== "function") {
            throw new TypeError(ErrorMessages.JWT_CORE_INCOMPATIBLE);
        }
        super();
    }


    public async validate<Payload extends DefaultPayload> (token: string, keyOrSecret: string): Promise<JwtResult<Payload>> {
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = this.driver.verify(token, keyOrSecret, this.getOptions());
            result.success = true;
            result.payload = validation as JwtPayload;
        } catch (err: any) {
            result.message = err?.message;
        }
        return result as JwtResult<Payload>;
    }

}