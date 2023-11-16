import { Context } from 'react';
import { axiosInstance } from 'utils/services/service/axiosService';
import { ContextProps } from 'types/user';
import { AuthResponse } from 'types/authResponse';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';
import { Contextualizer } from 'utils/services/contextualizer';
import { ProvidedServices } from 'utils/services/providedServices';

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  signup(
    email: string,
    password: string,
    address: string,
    name: string
  ): Promise<AuthResponse>;
  logout(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }>;
}

export const AuthServiceContext: Context<
  IAuthService | undefined
> = Contextualizer.createContext(ProvidedServices.AuthService);

export const useAuthServices = (): IAuthService =>
  Contextualizer.use<IAuthService>(ProvidedServices.AuthService);

export const AuthService = ({ children }: ContextProps): JSX.Element => {
  const authService = {
    async login(email: string, password: string): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/users/login/admin', {
          email,
          password,
        });

        if (response?.data?.success) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.userData.token
          );
        }

        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    async signup(
      email: string,
      password: string,
      address: string,
      name: string
    ): Promise<AuthResponse> {
      try {
        const response = await axiosInstance.post('/users/signup', {
          email,
          password,
          address,
          name,
        });

        if (response.data.success && response.data.token) {
          localStorage.setItemInLocalStorage(
            localStorageKeys.TOKEN_KEY,
            response.data.token
          );
        }

        return response.data;
      } catch (err) {
        throw new Error(err);
      }
    },
    async logout(): Promise<{
      success: boolean;
      message?: string;
      error?: string;
    }> {
      try {
        const response = await axiosInstance.post('/users/logout');

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
  };

  return (
    <AuthServiceContext.Provider value={authService}>
      {children}
    </AuthServiceContext.Provider>
  );
};
