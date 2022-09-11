export class JwtDriver {
    constructor() {
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
