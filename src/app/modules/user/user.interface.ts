import { userRole } from "./user.const";

type TUserRoles =
  | "customer"
  | "vendor"
  | "sr"
  | "seller"
  | "vendor-staff"
  | "admin"
  | "admin-staff"
  | "super-admin";

type TGender = "male" | "female" | "other";

type TUserStatus = "active" | "pending" | "blocked";

export interface IAuthProvider {
  provider: string;
  providerId: string;
}
export type TUser = {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role?: TUserRoles;
  gender?: TGender;
  contactNo?: string;
  bio?: string;
  status?: TUserStatus;
  walletPoint?: number;
  commissionBalance?: number;
  socials?: string[];
  cardInfo?: null;
  auths: IAuthProvider[];
};

export type TUserRole = keyof typeof userRole;
