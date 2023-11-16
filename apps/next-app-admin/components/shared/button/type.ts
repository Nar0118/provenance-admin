import { ButtonProps as AntdButtonProps } from 'antd/lib/button';

export default interface ButtonProps extends AntdButtonProps {
  onClick?: (() => Promise<void>) | (() => void) | undefined;
  text?: string;
  transparent?: boolean;
  btnType?: ButtonType;
  isUpdatedButton?: boolean;
  iconSrc?: string;
}

export enum ButtonType {
  blue = 'blue',
  black = 'black',
  white = 'white',
  blackBorder = 'blackBorder',
  whiteBorder = 'whiteBorder',
  edit = 'update',
  delete = 'delete',
  href = 'href',
}
