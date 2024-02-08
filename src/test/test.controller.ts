import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, UsePipes} from '@nestjs/common';
import {TestService} from './test.service';
import {CreateTestDto} from './dto/create-test.dto';
import {Roles} from "../auth/role-auth-decor";
import {AuthGuard} from "@nestjs/passport";
import {CompanyDec} from "../auth/decor-company-fromJwt";
import {User} from "../user/entities/user.entity";
import {UserDec} from "../auth/decor-pass-user";
import {Company} from "../company/entities/company.entity";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {TTest} from "../gen-responce/interface/customResponces";
import {JwtRoleMemberGuard} from "../auth/jwt-Role-Member.guard";

@Controller('test')
export class TestController {
   constructor(private readonly testService: TestService) {
   }

   //1.Members of company can create Test
   //Endpoint: Post /test/create
   //Permissions: Only Members of company
   /*expect:{
    "description": "Перший тест",
    "companyId": "1",
    "questions": [
        {
            "questionText": "capital of ukraine ",
            "rightAnswer": "Kiev",
            "varsAnswers": [
                {"varAnswer": "Kiev"},
                {"varAnswer": "Odessa"},
                {"varAnswer": "Kropivnitskiy"}
            ]
        },
        {
            "questionText": "bigest river ukraine",
            "rightAnswer": "dnipro",
            "varsAnswers": [
                {"varAnswer": "inhul"},
                {"varAnswer": "inhuletc"},
                {"varAnswer": "dnipro"}
            ]
        }
    ]
}
  */
   @Post('/create')
   @Roles('MEMBER')
   @UseGuards(AuthGuard(['jwt-auth']), JwtRoleMemberGuard)
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   createTest(@UserDec() userFromGuard: User, @CompanyDec() companyFromGuard: Company,
              @Body() createTestDto: CreateTestDto): Promise<GeneralResponse<TTest>> {
      return this.testService.createTest(userFromGuard, createTestDto, companyFromGuard);
   }


}
