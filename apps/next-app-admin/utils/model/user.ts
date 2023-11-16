import { UserRoles, UserType } from 'utils/constants/userRoles';

export interface User {
  _id: string;
  role: UserRoles;
  email: string;
  userType?: UserType;
}
