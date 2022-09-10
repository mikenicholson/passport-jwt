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
export declare type JwtResult<T extends Record<string, any>> = JwtResultPositive<T> | JwtResultNegative;
export declare abstract class JwtDriver<Driver, Options, Key> {
    protected readonly abstract driver: Driver;
    protected readonly abstract options?: Options;
    protected abstract defaultOptions: Options;
    protected getOptions(): Options;
    abstract validate<Output extends Record<string, any>>(token: string, keyOrSecret: Key): Promise<JwtResult<Output>>;
}
