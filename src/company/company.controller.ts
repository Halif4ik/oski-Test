import {Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CreateCompanyDto} from './dto/create-company.dto';
import {UpdateCompanyDto} from './dto/update-company.dto';
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "../auth/decor-pass-user";
import {User} from "../user/entities/user.entity";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {ICompany} from "../gen-responce/interface/customResponces";

@Controller('company')
export class CompanyController {
   constructor(private readonly companyService: CompanyService) {
   }

   //1.Logined users(with token) can Create Company and become member of it
   //Endpoint: POST /company/create
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   @UseGuards(AuthGuard(['jwt-auth']))
   @Post("/create")
   async createCompany(@UserDec() user: User, @Body() companyData: CreateCompanyDto): Promise<GeneralResponse<ICompany>> {
      return this.companyService.create(user, companyData);
   }

   //2.Logged users can add to created company
   //Endpoint: Patch /company/add_member
   //Permissions: All users with token
   @Patch("/add_member")
   @UseGuards(AuthGuard(['jwt-auth']))
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async addMember(@UserDec() user: User, @Body() updateCompanyData: UpdateCompanyDto): Promise<GeneralResponse<ICompany>> {
      return this.companyService.addMember(user, updateCompanyData);
   }



}
