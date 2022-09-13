export type DefaultPayload = Record<string, any>;

export interface JwtResultPositive<Payload extends DefaultPayload> {
    success: true;
    payload: Payload;
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

export type JwtResult<Payload extends DefaultPayload> = JwtResultPositive<Payload> | JwtResultNegative;

export abstract class JwtDriver<Core, Options, Key> {

    protected keyIsProvidedByMe: boolean = false;

    constructor(
        protected readonly core: Core,
        protected readonly options?: Options
    ) {}

    protected abstract defaultOptions: Options;

    protected getOptions(): Options {
        return {...this.defaultOptions, ...this.options};
    }

    public abstract validate<Output extends DefaultPayload>(token: string, keyOrSecret: Key): Promise<JwtResult<Output>>;
}

export abstract class JwtProvidedDriver<Core, Options> extends JwtDriver<Core, Options, undefined> {
    protected override keyIsProvidedByMe: true = true;
}