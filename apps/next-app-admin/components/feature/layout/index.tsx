import { useEffect } from 'react';
import Header from 'components/feature/header';
import { LayoutProps } from './types';

import styles from './layout.module.scss';

export default function Layout({ children }: LayoutProps): JSX.Element {
  useEffect(() => {
    document.getElementById('__next').style.height = '100%';
  }, []);

  return (
    <div className={styles.generalModeBg}>
      <Header />
      {children}
    </div>
  );
}
