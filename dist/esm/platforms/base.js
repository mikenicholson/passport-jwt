export class JwtDriver {
    constructor(core, options) {
        this.core = core;
        this.options = options;
        this.keyIsProvidedByMe = false;
    }
    getOptions() {
        return Object.assign(Object.assign({}, this.defaultOptions), this.options);
    }
}
export class JwtProvidedDriver extends JwtDriver {
    constructor() {
        super(...arguments);
        this.keyIsProvidedByMe = true;
    }
}
//# sourceMappingURL=base.js.map