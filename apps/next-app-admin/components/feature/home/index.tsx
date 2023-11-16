import Button from 'components/shared/button';
import { ButtonType } from 'components/shared/button/type';

import styles from './home.module.scss';

export default function HomePage(): JSX.Element {
  return (
    <div className={styles.admin}>
      <h1>Admin Dashboard</h1>
      <Button
        text="Users"
        btnType={ButtonType.whiteBorder}
        href="/users"
      />
      <Button text='Events' btnType={ButtonType.whiteBorder} href="/events"/>
    </div>
  );
}
