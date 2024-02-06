import {Module} from '@nestjs/common';
import {CompanyService} from './company.service';
import {CompanyController} from './company.controller';
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {Company} from "./entities/company.entity";

@Module({
   controllers: [CompanyController],
   providers: [CompanyService],
   imports: [UserModule,
      TypeOrmModule.forFeature([Company]),
      JwtModule, PassportModule],
   exports: [CompanyService]
})
export class CompanyModule {
}
