declare module "passport-jwt" {
    export * from "./dist/types/index";
}

declare module "passport-jwt/auto" {
    export * from "./dist/types/auto/index";
}

declare module "passport-jwt/platform-jose" {
    export * from "./dist/types/platforms/jose";
}

declare module "passport-jwt/platform-jsonwebtoken" {
    export * from "./dist/types/platforms/jsonwebtoken";
}

declare module "passport-jwt/platform-nestjsjwt" {
    export * from "./dist/types/platforms/nestjsjwt";
}