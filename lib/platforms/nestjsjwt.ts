import {DefaultPayload, JwtProvidedDriver, JwtResult, JwtResultInternal} from "./base";
import type {JwtVerifyOptions, JwtService} from "@nestjs/jwt";
import {ErrorMessages} from "../error_messages";

type NestJsJwtDriverCore = { verifyAsync: JwtService["verifyAsync"] };

export class NestJsJwtDriver extends JwtProvidedDriver<NestJsJwtDriverCore, JwtVerifyOptions> {
    protected defaultOptions: JwtVerifyOptions = {algorithms: ["HS256"]};

    constructor(
        core: NestJsJwtDriverCore,
        options?: JwtVerifyOptions
    ) {
        if (typeof core !== "object" || !("verifyAsync" in core) || typeof core["verifyAsync"] !== "function") {
            throw new TypeError(ErrorMessages.NEST_CORE_INCOMPATIBLE);
        }
        super(core, options);
    }

    public async validate<Payload extends DefaultPayload>(token: string, keyOrSecret?: string): Promise<JwtResult<Payload>> {
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = await this.core.verifyAsync(token, this.getOptions());
            result.success = true;
            result.payload = validation;
        } catch (err: any) {
            result.message = err?.message;
        }
        return result as JwtResult<Payload>;
    }
}