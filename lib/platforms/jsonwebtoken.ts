import {JwtDriver, JwtResult, JwtResultInternal} from "./base";
import type {VerifyOptions, verify, JwtPayload} from "jsonwebtoken";

type JsonWebTokenDriverType = { verify: typeof verify };

export class JsonWebTokenDriver extends JwtDriver<JsonWebTokenDriverType, VerifyOptions, string> {
    protected defaultOptions: VerifyOptions = {algorithms: ["HS256"]};

    constructor(
        public readonly driver: JsonWebTokenDriverType,
        protected readonly options?: VerifyOptions
    ) {
        if(typeof driver !== "object" || !("verify" in driver) || typeof driver["verify"] !== "function") {
            throw new TypeError("A none 'jsonwebtoken' compatible core has been passed.");
        }
        super();
    }


    public async validate<T extends Record<string, any>> (token: string, keyOrSecret: string): Promise<JwtResult<T>> {
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = this.driver.verify(token, keyOrSecret, this.getOptions());
            result.success = true;
            result.payload = validation as JwtPayload;
        } catch (err: any) {
            result.message = err.message;
        }
        return result as JwtResult<T>;
    }

}