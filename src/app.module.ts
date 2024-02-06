import {Module} from '@nestjs/common';
import {GenResponceModule} from './gen-responce/gen-responce.module';
import {GenResponceService} from "./gen-responce/gen-responce.service";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { TestModule } from './test/test.module';
import { WorkFlowModule } from './work-flow/work-flow.module';

@Module({
   providers: [GenResponceService],
   imports: [ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
   }),
      TypeOrmModule.forRoot({
         type: 'postgres',
         host: process.env.POSTGRES_HOST,
         port: +process.env.POSTGRES_DOCKER_PORT,
         username: process.env.POSTGRES_USER,
         password: process.env.POSTGRES_ROOT_PASSWORD,
         database: process.env.POSTGRES_DATABASE,
         synchronize: false,// true only for course with out migration
         autoLoadEntities: true,
         // ssl: { rejectUnauthorized: false },for  connect to render
      }),
      GenResponceModule,
      UserModule,
      AuthModule,
      CompanyModule,
      TestModule,
      WorkFlowModule,
   ],
})

export class AppModule {
}
