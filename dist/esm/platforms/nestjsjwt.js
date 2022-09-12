import { __awaiter } from "tslib";
import { JwtProvidedDriver } from "./base";
import { ErrorMessages } from "../error_messages";
export class NestJsJwtDriver extends JwtProvidedDriver {
    constructor(driver, options) {
        if (typeof driver !== "object" || !("verifyAsync" in driver) || typeof driver["verifyAsync"] !== "function") {
            throw new TypeError(ErrorMessages.NEST_CORE_INCOMPATIBLE);
        }
        super();
        this.driver = driver;
        this.options = options;
        this.defaultOptions = { algorithms: ["HS256"] };
    }
    validate(token, keyOrSecret) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = { success: false, message: undefined };
            try {
                const validation = yield this.driver.verifyAsync(token, this.getOptions());
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
