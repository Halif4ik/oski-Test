import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {User} from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {TJwtBody} from "../gen-responce/interface/customResponces";

@Injectable()
export class JwtStrategyAuth extends PassportStrategy(Strategy, "jwt-auth") {
   constructor(private readonly userService: UserService) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: process.env.IGNORE_EXPIRATION_TOKEN === 'true',
         secretOrKey: process.env.SECRET_ACCESS,
      });
   }

   async validate(payload: unknown): Promise<User | null> {
      if (typeof payload !== 'object' || payload === null) return null;

      // jwt Payload is missing a required property and this point, payload is of type TJwtBody
      const requiredProperties: (keyof TJwtBody)[] = ['id', 'email', 'firstName'];
      for (const prop of requiredProperties) {
         if (!(prop in payload)) return null;
         if (prop === 'id' && typeof payload[prop] !== 'number') return null;
      }

      const jwtBody: TJwtBody = {
         email: payload['email'],
         id: payload['id'],
         firstName: payload['firstName'],
         iat: payload['iat'],
         exp: payload['exp'],
      };
      return this.userService.getUserByIdCompTargInviteRole(jwtBody.id);
   }
}