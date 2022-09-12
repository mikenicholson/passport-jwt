import {DefaultPayload, JwtProvidedDriver, JwtResult, JwtResultInternal} from "./base";
import type {JwtVerifyOptions, JwtService} from "@nestjs/jwt";
import {ErrorMessages} from "../error_messages";

type NestJsJwtDriverType = { verifyAsync: JwtService["verifyAsync"] };

export class NestJsJwtDriver extends JwtProvidedDriver<NestJsJwtDriverType, JwtVerifyOptions> {
    protected defaultOptions: JwtVerifyOptions = {algorithms: ["HS256"]};

    constructor(
        public readonly driver: NestJsJwtDriverType,
        protected readonly options?: JwtVerifyOptions
    ) {
        if (typeof driver !== "object" || !("verifyAsync" in driver) || typeof driver["verifyAsync"] !== "function") {
            throw new TypeError(ErrorMessages.NEST_CORE_INCOMPATIBLE);
        }
        super();
    }

    public async validate<Payload extends DefaultPayload>(token: string, keyOrSecret?: string): Promise<JwtResult<Payload>> {
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = await this.driver.verifyAsync(token, this.getOptions());
            result.success = true;
            result.payload = validation;
        } catch (err: any) {
            result.message = err?.message;
        }
        return result as JwtResult<Payload>;
    }
}