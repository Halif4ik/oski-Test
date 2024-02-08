import {Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginUserDto} from "./dto/login-auth.dto";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {IRespAuth, IUserInfo} from "../gen-responce/interface/customResponces";
import {AuthGuard} from "@nestjs/passport";
import {UserDec} from "./decor-pass-user";
import {User} from "../user/entities/user.entity";

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {
   }

   //1.Registered users can loginin system  Promise<GeneralResponse<IRespAuth>>
   //Endpoint: POST /auth/login
   @UsePipes(new ValidationPipe({transform: true, whitelist: true}))
   @Post('/login')
   async login(@Body() loginDto: LoginUserDto): Promise<GeneralResponse<any>> {
      return this.authService.login(loginDto);
   }

   //2. Test endpoint for checking the info about me
   //Endpoint: GET /auth/me
   @UseGuards(AuthGuard( 'jwt-auth'))
   @Get("/me")
   async userInfo(@UserDec() userFromGuard: User): Promise<GeneralResponse<IUserInfo>> {
      return this.authService.getUserInfo(userFromGuard);
   }
}
