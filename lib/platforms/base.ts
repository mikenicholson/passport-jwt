export interface JwtResultPositive<Output extends Record<string, any>> {
    success: true;
    payload: Output;
    message: undefined;
}

export interface JwtResultNegative {
    success: false;
    message: string | undefined;
}

export interface JwtResultInternal {
    success: boolean;
    payload?: object;
    message?: string;
}

export type JwtResult<T extends Record<string, any>> = JwtResultPositive<T> | JwtResultNegative;

export abstract class JwtDriver<Driver, Options, Key> {

    protected keyIsProvidedByMe: boolean = false;

    public readonly abstract driver: Driver;

    protected readonly abstract options?: Options;

    protected abstract defaultOptions: Options;

    protected getOptions(): Options {
        return {...this.defaultOptions, ...this.options};
    }

    public abstract validate<Output extends Record<string, any>>(token: string, keyOrSecret: Key): Promise<JwtResult<Output>>;
}

export abstract class JwtProvidedDriver<Driver, Options> extends JwtDriver<Driver, Options, undefined> {
    protected override keyIsProvidedByMe: true = true;
}