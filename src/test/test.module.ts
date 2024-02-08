import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import {Question} from "./entities/question.entity";
import {Answers} from "./entities/answers.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CompanyModule} from "../company/company.module";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {Test} from "./entities/test.entity";
import {PassedTest} from "./entities/passedTest.entity";
import {GeneralRating} from "./entities/generalRating.entity";
import {AvgRating} from "./entities/averageRating.entity";

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [
    UserModule,
    CompanyModule,
    TypeOrmModule.forFeature([Test,Question,Answers,PassedTest,GeneralRating,AvgRating]),
    JwtModule, PassportModule
  ],
  exports: [TestService]
})
export class TestModule {}
