export declare type DefaultPayload = Record<string, any>;
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
export declare type JwtResult<T extends DefaultPayload> = JwtResultPositive<T> | JwtResultNegative;
export declare abstract class JwtDriver<Driver, Options, Key> {
    protected keyIsProvidedByMe: boolean;
    abstract readonly driver: Driver;
    protected readonly abstract options?: Options;
    protected abstract defaultOptions: Options;
    protected getOptions(): Options;
    abstract validate<Output extends DefaultPayload>(token: string, keyOrSecret: Key): Promise<JwtResult<Output>>;
}
export declare abstract class JwtProvidedDriver<Driver, Options> extends JwtDriver<Driver, Options, undefined> {
    protected keyIsProvidedByMe: true;
}
