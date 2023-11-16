import { CheckboxProps } from 'antd/lib/checkbox';

export interface CheckboxLabelData {
  link: string;
  linkText: string;
}

export default interface CheckBoxProps extends CheckboxProps {
  text: string;
  data?: CheckboxLabelData[];
}
