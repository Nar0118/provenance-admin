import { Input as AntdInput } from 'antd';
import InputProps from './types';

export default function Input({ label, onChange, ...rest }: InputProps) {
  return (
    <div>
      {label && <label htmlFor={rest.id}>{label}</label>}
      <AntdInput
        className={rest.className}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
}
