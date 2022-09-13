import {DefaultPayload, JwtDriver, JwtResult, JwtResultInternal} from "./base";
import type {VerifyOptions, jwtVerify, KeyLike} from "jose";
import {createSecretKey} from "crypto";
import {ErrorMessages} from "../error_messages";

type JoseDriverType = { jwtVerify: typeof jwtVerify }

export class JoseDriver extends JwtDriver<JoseDriverType, VerifyOptions, KeyLike | string> {

    protected defaultOptions: VerifyOptions = {algorithms: ["HS256"]};

    constructor(
        core: JoseDriverType,
        options?: VerifyOptions
    ) {
        if (typeof core !== "object" || !("jwtVerify" in core) || typeof core["jwtVerify"] !== "function") {
            throw new TypeError(ErrorMessages.JOSE_CORE_INCOMPATIBLE);
        }
        super(core, options);
    }

    public async validate<Payload extends DefaultPayload>(token: string, keyOrSecret: string | KeyLike): Promise<JwtResult<Payload>> {
        let jwk: KeyLike | undefined = undefined;
        if (typeof keyOrSecret === "string") {
            jwk = createSecretKey(Buffer.from(keyOrSecret));
        } else {
            jwk = keyOrSecret;
        }
        const result: JwtResultInternal = {success: false, message: undefined};
        try {
            const validation = await this.core.jwtVerify(token, jwk, this.getOptions());
            result.success = true;
            result.payload = validation.payload;
        } catch (err: any) {
            result.message = err?.message;
        }
        return result as JwtResult<Payload>;
    }

}