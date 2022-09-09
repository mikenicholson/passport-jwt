export class JwtDriver {
    getOptions() {
        return Object.assign(Object.assign({}, this.defaultOptions), this.options);
    }
}
