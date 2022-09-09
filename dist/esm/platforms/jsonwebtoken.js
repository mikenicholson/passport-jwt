import { __awaiter } from "tslib";
import { JwtDriver } from "./base";
export class JsonWebTokenDriver extends JwtDriver {
    constructor(driver, options) {
        if (typeof driver !== "object" || !("verify" in driver) || typeof driver["verify"] !== "function") {
            throw new TypeError("A none 'jsonwebtoken' compatible core has been passed.");
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
                const validation = this.driver.verify(token, keyOrSecret, this.getOptions());
                result.success = true;
                result.payload = validation;
            }
            catch (err) {
                result.message = err.message;
            }
            return result;
        });
    }
}
