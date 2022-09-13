import { __awaiter } from "tslib";
import { JwtDriver } from "./base";
import { createSecretKey } from "crypto";
import { ErrorMessages } from "../error_messages";
export class JoseDriver extends JwtDriver {
    constructor(core, options) {
        if (typeof core !== "object" || !("jwtVerify" in core) || typeof core["jwtVerify"] !== "function") {
            throw new TypeError(ErrorMessages.JOSE_CORE_INCOMPATIBLE);
        }
        super(core, options);
        this.defaultOptions = { algorithms: ["HS256"] };
    }
    validate(token, keyOrSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            let jwk = undefined;
            if (typeof keyOrSecret === "string") {
                jwk = createSecretKey(Buffer.from(keyOrSecret));
            }
            else {
                jwk = keyOrSecret;
            }
            const result = { success: false, message: undefined };
            try {
                const validation = yield this.core.jwtVerify(token, jwk, this.getOptions());
                result.success = true;
                result.payload = validation.payload;
            }
            catch (err) {
                result.message = err === null || err === void 0 ? void 0 : err.message;
            }
            return result;
        });
    }
}
//# sourceMappingURL=jose.js.map