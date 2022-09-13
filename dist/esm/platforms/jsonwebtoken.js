import { __awaiter } from "tslib";
import { JwtDriver } from "./base";
import { ErrorMessages } from "../error_messages";
export class JsonWebTokenDriver extends JwtDriver {
    constructor(core, options) {
        if (typeof core !== "object" || !("verify" in core) || typeof core["verify"] !== "function") {
            throw new TypeError(ErrorMessages.JWT_CORE_INCOMPATIBLE);
        }
        super(core, options);
        this.defaultOptions = { algorithms: ["HS256"] };
    }
    validate(token, keyOrSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = { success: false, message: undefined };
            try {
                const validation = this.core.verify(token, keyOrSecret, this.getOptions());
                result.success = true;
                result.payload = validation;
            }
            catch (err) {
                result.message = err === null || err === void 0 ? void 0 : err.message;
            }
            return result;
        });
    }
}
//# sourceMappingURL=jsonwebtoken.js.map