import Image from 'components/shared/image';

import styles from './authLayout.module.scss';

export default function AuthLayout({ children }): JSX.Element {
  return (
    <div className={styles.background}>
      <div className={styles.imageContainer}>
        <Image
          src="/image/Illustration.png"
          width="100"
          height="100"
          objectFit="cover"
          layout="responsive"
        />
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
}
