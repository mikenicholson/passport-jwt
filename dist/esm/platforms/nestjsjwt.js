import { __awaiter } from "tslib";
import { JwtProvidedDriver } from "./base";
export class NestJsJwtDriver extends JwtProvidedDriver {
    constructor(driver, options) {
        if (typeof driver !== "object" || !("verify" in driver) || typeof driver["verify"] !== "function") {
            throw new TypeError("A none '@nestjs/jwt' compatible core has been passed.");
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
                const validation = this.driver.verify(token, this.getOptions());
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
