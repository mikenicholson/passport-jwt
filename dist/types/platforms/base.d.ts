export declare type DefaultPayload = Record<string, any>;
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
export declare type JwtResult<Payload extends DefaultPayload> = JwtResultPositive<Payload> | JwtResultNegative;
export declare abstract class JwtDriver<Core, Options, Key> {
    protected readonly core: Core;
    protected readonly options?: Options | undefined;
    protected keyIsProvidedByMe: boolean;
    constructor(core: Core, options?: Options | undefined);
    protected abstract defaultOptions: Options;
    protected getOptions(): Options;
    abstract validate<Output extends DefaultPayload>(token: string, keyOrSecret: Key): Promise<JwtResult<Output>>;
}
export declare abstract class JwtProvidedDriver<Core, Options> extends JwtDriver<Core, Options, undefined> {
    protected keyIsProvidedByMe: true;
}
