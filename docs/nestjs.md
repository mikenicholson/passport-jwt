# NestJs integration

Below is an example of how to integrate `passport-jwt` with `@nestjs/passport`, storing the JWT as a cookie. These examples can help get you started with `nestjs`.

### main.ts
The main file of the nestjs framework, the current example uses a cookie to store the token, so we need to add a cookie parser from `cookie-parser`.
```typescript
import * as cookieParser from 'cookie-parser';
// somewhere in your initialization file
app.use(cookieParser());
```
### user.type.ts
The file of the user type where we store the signature of our payload and our profile, this must be an entity associated with an orm in a production framework.
```typescript
export type MyPayload = { sub: number; name: string };
export type MyProfile = { id: number; username: string; displayname: string };
```
### app.module.ts
The main module of our example, note that the jwt service and our jwtstragy are imported here. 
the secret is passed to the jwt module, of course this is extracted from the environment in a product application.
The jwt module is seen by our package as a `JwtProvidedDriver` or a driver that takes care of a secret itself.
```typescript
import { Module } from "@nestjs/common";
import { PassportModlue } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { AppController } from "./app.controller";
import { UserService } from "./user.service";

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
    controllers: [
        AppController
    ],
    proivders: [
        JwtStrategy,
        UserService
    ]
})
export class AppModule {

}
```
### app.controller.ts
The controller uses our strategy as `AuthGuard` which is called `jwt` by default.
```typescript
import { Res, Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { MyPayload, MyProfile } from "./profile.type";

@Controller()
export class AppController {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post('login')
  public async login(
      @Body() loginReq: {user: string; pass: string}, 
      @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const user = await this.usersService.findOne(loginReq.user);
    if (user && user.password === loginReq.pass) {
      const payload: MyPayload = { sub: user.userId, name: user.username };
      const token = await this.jwtService.signAsync(payload);
      res.cookie('jwt', token);
    }
    res.redirect('/profile');
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public getProfile(@Request() req): MyProfile {
    return req.user;
  }
}
```
### jwt.strategy.ts
This is the strategy and main intergation of `passport-jwt` with `nestjs`. 
Notice how we use the `passport-jwt/platform-nestjsjwt` for better intergration and therefore we don't need to pass a `secretOrProvider` (because it's in the `AppModule`). 
Of course any driver can be used and you are not stuck with the one from `nestjs`.
```typescript
import { PassportStrategy } from "@nestjs/passport"
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt, JwtStrategyOptions} from "passport-jwt";
import { JwtService } from "@nestjs/jwt";
import { NestJsJwtDriver } from "passport-jwt/platform-nestjsjwt";
import { MyPayload, MyProfile } from "./profile.type";
import { UserService } from "./user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(jwtCore: JwtService, private userService: UserService) {
      const opts: JwtStrategyOptions = {
        jwtFromRequest: ExtractJwt.fromCookie("jwt"),
        jwtDriver: new NestJsJwtDriver(jwtCore)
      }
      super(opts);
    }

    public async validate(payload: MyPayload): Promise<MyProfile> {
        const user = await this.userService.findOne(payload.sub);
        if (!user) throw new UnauthorizedException('user deleted from db');
        return {id: user.id, username: user.username, displayname: user.fullname};
    }
}
```
See the documentation [here](https://docs.nestjs.com/security/authentication) from `@nestjs/passport` for more examples.
Only open an issue if there are errors in the `passport-jwt` library, issues for `nestjs` in general will be ignored.

This example shows a most basic implementation which should only be used for refrence purposes,
there are many realworld standards which should be used like bcrypt for password hashing.
