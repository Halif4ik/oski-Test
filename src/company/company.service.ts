import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateCompanyDto} from './dto/create-company.dto';
import {Company} from "./entities/company.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import {ICompany} from "../gen-responce/interface/customResponces";
import {User} from "../user/entities/user.entity";
import {UpdateCompanyDto} from "./dto/update-company.dto";

@Injectable()
export class CompanyService {
   private readonly logger: Logger = new Logger(CompanyService.name);

   constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {
   }

   async create(user: User, companyData: CreateCompanyDto): Promise<GeneralResponse<ICompany>> {
      const isExistCompany: Company = await this.companyRepository.findOne({
         where: {
            name: companyData.name
         }
      });
      if (isExistCompany) throw new Error("Company with this name already exist");

      const newCompany: Company = this.companyRepository.create({
         ...companyData,
         members: [user],
      });
      const resultCompany: Company = await this.companyRepository.save(newCompany);
      this.logger.log(`Saved new company- ${newCompany.name}`);
      return {
         "status_code": HttpStatus.OK,
         "detail": {
            "company": resultCompany
         },
         "result": "saved"
      };
   }


   async addMember(userFromGuard: User, updateCompanyData: UpdateCompanyDto): Promise<GeneralResponse<ICompany>> {
      const targetCompany: Company = await this.companyRepository.findOne({
         where: {
            id: updateCompanyData.id
         },
         relations: ['members']
      });
      if (!targetCompany) throw new HttpException(`Company with this ${updateCompanyData.id} dosen't exist`, HttpStatus.NOT_FOUND);

      targetCompany.members.push(userFromGuard);
      await this.companyRepository.save(targetCompany);

      this.logger.log(`Changed list members for new-'${userFromGuard.firstName}' in company - ${targetCompany.name}`);
      return {
         "status_code": HttpStatus.OK,
         "detail": {
            "company": targetCompany,
         },
         "result": "update"
      };

   }
}
