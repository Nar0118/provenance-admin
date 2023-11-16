import { Checkbox } from 'antd';
import Link from 'components/shared/link';
import CheckBoxProps, { CheckboxLabelData } from './types';

import styles from './checkbox.module.scss';

export default function CheckBox({
  text,
  data,
  ...rest
}: CheckBoxProps): JSX.Element {
  return (
    <div className={styles.checkboxContainer}>
      <Checkbox {...rest} />
      <label htmlFor={rest.id} className={styles.label}>
        {text}
        {data?.map((item: CheckboxLabelData, index: number) => {
          return (
            <span key={index}>
              <Link text={item.linkText} href={item.link} />
              {index < data.length - 1 && <span>and</span>}
            </span>
          );
        })}
      </label>
    </div>
  );
}
