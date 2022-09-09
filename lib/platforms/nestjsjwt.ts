import {JwtDriver, JwtResult, JwtResultInternal} from "./base";
import type {JwtVerifyOptions, JwtService} from "@nestjs/jwt";

type NestJsJwtDriverType = { verify: JwtService["verify"] };

export class NestJsJwtDriver extends JwtDriver<NestJsJwtDriverType, JwtVerifyOptions, undefined> {
    protected defaultOptions: JwtVerifyOptions = {algorithms: ["HS256"]};

    constructor(
        protected readonly driver: NestJsJwtDriverType,
        protected readonly options?: JwtVerifyOptions
    ) {
        if (typeof driver !== "object" || !("verify" in driver) || typeof driver["verify"] !== "function") {
            throw new TypeError("A none '@nestjs/jwt' compatible core has been passed.");
        }
        super();
    }

    public async validate<T extends Record<string, any>>(token: string, keyOrSecret?: string): Promise<JwtResult<T>> {
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = this.driver.verify(token, this.getOptions());
            result.success = true;
            result.payload = validation;
        } catch (err: any) {
            result.message = err.message;
        }
        return result as JwtResult<T>;
    }
}