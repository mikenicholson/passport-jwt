# NestJs integration

Below is an example of how to integrate `passport-jwt` with `@nestjs/passport`. These examples can help get you started with `nestjs`.

```typescript
// app.module.ts
import {Module, APP_GUARD} from "@nestjs/common";
import {PassportModlue, AuthGuard} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow("jwt.secret"),
                signOptions: {expiresIn: '2h'}
            }),
            inject: [ConfigService]
        })
    ],
    proivders: [
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: AuthGuard('jwt')
        }
    ]
})
export class AppModule {

}
```
```typescript
// jwt.strategy.ts
import {PassportStrategy} from "@nestjs/passport"
import {Injectable} from "@nestjs/common";
import {Strategy, ExtractJwt} from "passport-jwt";
import {JwtService} from "@nestjs/jwt";
import {NestJsJwtDriver} from "passport-jwt/platform-nestjsjwt";

type MyPayload = {name: string};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy<MyPayload>) {
    constructor(jwtCore: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            jwtDriver: new NestJsJwtDriver(jwtCore)
        });
    }

    public async validate(payload: MyPayload): Promise<MyUser> {
        //... validation logic
    }
}
```
See the documentation from `@nestjs/passport` for more examples. 
Only open an issue if there are errors in the `passport-jwt` library, issues for `nestjs` in general will be ignored.
