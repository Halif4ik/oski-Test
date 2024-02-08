import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {User} from "./entities/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
   controllers: [UserController],
   providers: [UserService],
   imports: [
      TypeOrmModule.forFeature([User]),
      JwtModule, PassportModule],
   exports: [UserService]
})
export class UserModule {
}
