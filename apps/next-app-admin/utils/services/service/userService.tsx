import { Context } from 'react';
import { AuthResponse } from 'types/authResponse';
import { UserRoles } from 'utils/constants/userRoles';
import { User } from '../../model/user';
import { Contextualizer } from '../contextualizer';
import { ProvidedServices } from '../providedServices';
import { axiosInstance } from 'utils/services/service/axiosService';

export interface IUserService {
  getAllUsers(
    limit?: number,
    offset?: number
  ): Promise<{
    users: User[];
    count: number;
  }>;
  updateUser(
    user: User
  ): Promise<{
    success: boolean;
    data: User;
  }>;
  deleteUser(id: string): Promise<AuthResponse>;
  createUser(
    email: string,
    password: string,
    role: UserRoles
  ): Promise<{
    success: boolean;
    data: User;
  }>;
}

export const UserServiceContext: Context<
  IUserService | undefined
> = Contextualizer.createContext(ProvidedServices.UserService);

export const useUserServices = () =>
  Contextualizer.use<IUserService>(ProvidedServices.UserService);

export const UserService = ({ children }: any) => {
  const userService = {
    async getAllUsers(
      limit: number = 0,
      offset: number = 0
    ): Promise<{
      users: User[];
      count: number;
    }> {
      try {
        const response = await axiosInstance.get(
          `/users/admin?limit=${limit}&offset=${offset}`
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async updateUser(
      user: User
    ): Promise<{
      success: boolean;
      data: User;
    }> {
      try {
        const response = await axiosInstance.put(
          `/users/admin/update-user/${user._id}`,
          {
            role: user.role,
            email: user.email,
            userType: user.userType
          }
        );

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async deleteUser(id: string): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.delete(`/users/admin/${id}`);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    async createUser(
      email: string,
      password: string,
      role: UserRoles
    ): Promise<{
      success: boolean;
      data: User;
    }> {
      try {
        const response = await axiosInstance.post('/users/admin', {
          email,
          password,
          role,
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <UserServiceContext.Provider value={userService}>
      {children}
    </UserServiceContext.Provider>
  );
};
