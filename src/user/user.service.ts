import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {IUserInfo} from "../gen-responce/interface/customResponces";
import {GeneralResponse} from "../gen-responce/interface/generalResponse.interface";
import * as bcrypt from "bcryptjs";
import {ConfigService} from "@nestjs/config";
import {Company} from "../company/entities/company.entity";

@Injectable()
export class UserService {
   private readonly logger: Logger = new Logger(UserService.name);

   constructor(@InjectRepository(User) private usersRepository: Repository<User>,
               private jwtService: JwtService, private readonly configService: ConfigService,) {
   }

   async createUser(createUserDto: CreateUserDto): Promise<GeneralResponse<IUserInfo>> {
      const userFromBd: User = await this.usersRepository.findOneBy({email: createUserDto.email});
      if (userFromBd) throw new HttpException('User exist in bd', HttpStatus.CONFLICT);
      const hashPassword: string = await bcrypt.hash(createUserDto.password, +this.configService.get<number>("BCRYPT_FIVE"));

      const newUser: User = this.usersRepository.create({...createUserDto, password: hashPassword});
      // Save the new user to the database
      const createdUser: User = await this.usersRepository.save(newUser);
      this.logger.log(`Created new user- ${createdUser.email}`);
      return {
         "status_code": HttpStatus.OK,
         "detail": {
            "user": createdUser
         },
         "result": "createUser"
      }

   }

   async getUserByIdCompTargInviteRole(id: number): Promise<User | null> {
      return this.usersRepository.findOne({
         where: {id,},
         relations: ['companyMember']
      });
   }

   async getUserByEmailWithAuthPass(email: string): Promise<User | null> {
      return this.usersRepository.findOne({
         where: {email},
         relations: ['auth'],
         select: ['id', 'firstName', 'email', 'password']
      });
   }

   async addRelationToUser<T>(newRelation: T, targetUser: User): Promise<User> {
      let logMessage: string = '';
      if (newRelation instanceof Company) {
         logMessage = 'Company';
         targetUser.companyMember.length ? targetUser.companyMember.push(newRelation) : targetUser.companyMember = [newRelation];
      }

      const temp: User = await this.usersRepository.save(targetUser);
      this.logger.log(`Added relation ${logMessage} for user - ${targetUser.email}`);
      return temp;
   }
}
