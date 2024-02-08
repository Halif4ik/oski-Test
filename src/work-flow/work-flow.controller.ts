import {
   Controller,
   Get,
   UseGuards,
   UsePipes,
   ValidationPipe,
   Query, Post, Body
} from '@nestjs/common';
import {WorkFlowService} from './work-flow.service';
import {AuthGuard} from "@nestjs/passport";
import {JwtRoleMemberGuard} from "../auth/jwt-Role-Member.guard";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {TAnswers, TPassedTest} from "../gen-responce/interface/customResponces";
import {AdditionalUpdateTestId} from "../test/dto/update-test.dto";
import {CreateWorkFlowDto} from "./dto/create-work-flow.dto";

@Controller('work-flow')
export class WorkFlowController {
   constructor(private readonly workFlowService: WorkFlowService) {
   }

   //1.Logged users can start some  test for checked company
   //Endpoint: Get /work-flow/start?testId=10
   //Permissions: Only members
   @Get("/start")
   @UseGuards(AuthGuard(["jwt-auth"]), JwtRoleMemberGuard)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   start(@UserDec() userFromGuard: User, @Query() testIdDto: AdditionalUpdateTestId): Promise<GeneralResponse<TPassedTest>> {
      return this.workFlowService.start(userFromGuard, testIdDto.testId);
   }

   //2.Logged users can send answer for some started test for checked company
   //Endpoint: Post /work-flow/answer
   //expect: { "testId": "10", "questions": [{ "id": 7, "userAnswer": "kiev" }, { "id": 8, "userAnswer": "inhul" }] }
   //Permissions: All member Users who started test
   @Post("/answer")
   @UseGuards(AuthGuard(["jwt-auth"]), JwtRoleMemberGuard)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   createAnswers(@UserDec() userFromGuard: User, @Body() createWorkFlowDto: CreateWorkFlowDto): Promise<GeneralResponse<TAnswers>> {
      return this.workFlowService.createAnswers(userFromGuard, createWorkFlowDto);
   }
}
