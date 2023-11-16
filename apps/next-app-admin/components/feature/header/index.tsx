import { useContext } from 'react';
import { useRouter } from 'next/router';
import Icon from 'components/shared/icon';
import notification from 'components/shared/notification';
import { AuthContext } from 'utils/context/auth/context';
import navBarPaths from 'utils/constants/navBarPaths';
import localStorageKeys from 'utils/constants/localStorageKeys';
import { removeItemFromLocalStorage } from 'utils/services/localStorageService';
import { AuthServiceContext } from 'utils/services/service/authService';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const router = useRouter();
  const isAuthorized = useContext(AuthContext);
  const authService = useContext(AuthServiceContext);

  const goToHome = (): void => {
    router.push('/');
  };

  const redirectTo = async (path: string) => {
    if (path === navBarPaths.login) {
      const logout = await authService.logout();

      if (logout?.success) {
        notification({
          messageType: 'success',
          message: 'Success',
          description: logout.message,
        });
        removeItemFromLocalStorage(localStorageKeys.TOKEN_KEY);
        router.push(navBarPaths.login);
      } else {
        notification({
          messageType: 'error',
          message: 'Oops!',
          description: logout?.error ?? 'You are not registered',
        });
      }
    } else {
      router.push(path);
    }
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.container}>
        {isAuthorized && (
          <div className={styles.logOut}>
            <div
              className={styles.logOutItem}
              onClick={() => redirectTo(navBarPaths.login)}
            >
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
