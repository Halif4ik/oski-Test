import {User} from "../../user/entities/user.entity";
import {Auth} from "../../auth/entities/auth.entity";

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