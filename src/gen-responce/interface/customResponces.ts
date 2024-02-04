import {User} from "../../user/entities/user.entity";
import {Auth} from "../../auth/entities/auth.entity";
import {Company} from "../../company/entities/company.entity";

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