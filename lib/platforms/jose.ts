import {JwtDriver, JwtResult, JwtResultInternal} from "./base";
import type {VerifyOptions, jwtVerify, KeyLike} from "jose";
import {createSecretKey} from "crypto";

type JoseDriverType = { jwtVerify: typeof jwtVerify }

export class JoseDriver extends JwtDriver<JoseDriverType, VerifyOptions, KeyLike | string> {

    protected defaultOptions: VerifyOptions = {algorithms: ["HS256"]};

    constructor(
        public readonly driver: JoseDriverType,
        protected readonly options?: VerifyOptions
    ) {
        if (typeof driver !== "object" || !("jwtVerify" in driver) || typeof driver["jwtVerify"] !== "function") {
            throw new TypeError("A none 'jose' compatible core has been passed.");
        }
        super();
    }

    public async validate<T extends Record<string, any>>(token: string, keyOrSecret: string | KeyLike): Promise<JwtResult<T>> {
        let jwk: KeyLike | undefined = undefined;
        if (typeof keyOrSecret === "string") {
            jwk = createSecretKey(Buffer.from(keyOrSecret));
        } else {
            jwk = keyOrSecret;
        }
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = await this.driver.jwtVerify(token, jwk, this.getOptions());
            result.success = true;
            result.payload = validation.payload;
        } catch (err: any) {
            result.message = (err as Error).message;
        }
        return result as JwtResult<T>;
    }

}