import NextLink from 'next/link';
import LinkProps from './types';

import styles from './link.module.scss';

export default function Link({ text, color, ...rest }: LinkProps): JSX.Element {
  return (
    <div className={styles.linkBox} style={{ color }}>
      <NextLink {...rest}>{text}</NextLink>
    </div>
  );
}
