import {User} from "../../user/entities/user.entity";
import {Auth} from "../../auth/entities/auth.entity";

export interface IUserInfo {
   "user": User
}
export interface IRespAuth {
   "auth": Auth
}