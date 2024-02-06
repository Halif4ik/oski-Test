import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Auth} from "./entities/auth.entity";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {JwtStrategyAuth} from "./jwt.strategy";

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategyAuth],
   imports: [
      TypeOrmModule.forFeature([Auth]),
      UserModule,
      JwtModule,PassportModule
   ],
})
export class AuthModule {}
