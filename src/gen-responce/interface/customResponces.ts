import {User} from "../../user/entities/user.entity";
import {Auth} from "../../auth/entities/auth.entity";
import {Company} from "../../company/entities/company.entity";
import {Question} from "../../test/entities/question.entity";
import {Test} from "../../test/entities/test.entity";
import {AvgRating} from "../../test/entities/averageRating.entity";
import {PassedTest} from "../../test/entities/passedTest.entity";
import {Answers} from "../../test/entities/answers.entity";

export interface IUserInfo {
   "user": User
}

export interface IRespAuth {
   "auth": Auth
}

export type TJwtBody = {
   id: number,
   "email": string,
   "firstName": string,
   iat?: number,
   exp?: number
}

export interface ICompany {
   "company": Company | Company[]
}

export type TTest = { "test": TTestForResponse | TTestForResponse[] }

export type TTestForResponse = Omit<Test, 'company' | 'questions' | 'deleteAt' | 'passedTest' | 'description'> & {
   questions?: Question[];
   description?: string;
}

export type TPassedTest = {
   "test": TPassedTestForResponce
}
export type TPassedTestForResponce = Omit<PassedTest, 'user' | 'targetTest' | 'rightAnswers' | 'averageRating'> & {
   user?: TUserForResponse;
   targetTest?: TTestForResponse;
   averageRating?: AvgRating;
}
export type TUserForResponse =
    Omit<User, 'password' | 'deleteAt' | 'auth' |'companyMember' |'passedTest' | 'averageRating'>

export type TAnswers = { "answers": Answers[] }