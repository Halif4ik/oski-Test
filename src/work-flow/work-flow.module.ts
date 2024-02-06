import { Module } from '@nestjs/common';
import { WorkFlowService } from './work-flow.service';
import { WorkFlowController } from './work-flow.controller';
import {TestModule} from "../test/test.module";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {AvgRating} from "../test/entities/averageRating.entity";
import {GeneralRating} from "../test/entities/generalRating.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PassedTest} from "../test/entities/passedTest.entity";

@Module({
  controllers: [WorkFlowController],
  providers: [WorkFlowService],
  imports: [
    TestModule,
    ConfigModule,
    TypeOrmModule.forFeature([PassedTest, AvgRating, GeneralRating]),
    JwtModule,
    PassportModule,
  ],
})
export class WorkFlowModule {}
