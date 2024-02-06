import {Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {IUserInfo} from "../gen-responce/interface/customResponces";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";

@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService) {
   }

   //1.All users can Create register in system
   //Endpoint: POST /user/create
   @Post('create')
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   async create(@Body() createUserDto: CreateUserDto): Promise<GeneralResponse<IUserInfo>> {
      return this.userService.createUser(createUserDto);
   }

}
