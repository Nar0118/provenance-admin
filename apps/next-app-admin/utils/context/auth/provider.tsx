import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './context';
import * as localStorage from 'utils/services/localStorageService';
import localStorageKeys from 'utils/constants/localStorageKeys';

interface AuthProviderProps {
  children: React.ReactNode;
}
import navBarPaths from "utils/constants/navBarPaths";

const withoutAuthRoutes: Array<string> = [
  navBarPaths.login,
  navBarPaths.recoverPassword,
];


export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const router = useRouter();

  const [authorized, setAuthorized] = useState<boolean>(true);

  const redirectTo = (authToken: string | JSON, path: string): void => {
    if (!authToken) {
      setAuthorized(false);
      if (withoutAuthRoutes.includes(path.split('?')[0])) {
        router.push(path);
      } else {
        router.push(navBarPaths.login);
      }
    } else {
      setAuthorized(true);
      if (path === navBarPaths.login) {
        router.push('/');
      }
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItemFromLocalStorage(
      localStorageKeys.TOKEN_KEY
    );
    router.pathname !== '/signup' && redirectTo(authToken, router.asPath);
  }, [router.pathname]);

  return (
    <AuthContext.Provider value={authorized}>{children}</AuthContext.Provider>
  );
};
