import { InputProps } from 'antd/lib/input/Input';

export default interface CustomInputProps extends InputProps {
  label?: string;
  onChange?: (e: any) => void;
}
