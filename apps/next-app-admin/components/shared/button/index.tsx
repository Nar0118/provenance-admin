import { useState } from 'react';
import { Button as AntdButton, Spin } from 'antd';
import Icon from 'components/shared/icon';
import { returnsPromise } from 'utils';
import ButtonProps, { ButtonType } from './type';

import styles from './button.module.scss';

export default function Button({
  children,
  onClick,
  className,
  text,
  btnType,
  iconSrc,
  isUpdatedButton = false,
  ...rest
}: ButtonProps) {
  const [spinLoading, setSpinLoading] = useState<boolean>(false);

  const handleButton = async () => {
    if (!onClick) {
      return;
    }

    try {
      setSpinLoading(true);
      if (returnsPromise(!!onClick)) {
        await onClick();
      } else {
        onClick();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSpinLoading(false);
    }
  };

  const getStyle = (buttonType: ButtonType): string | null => {
    switch (buttonType) {
      case ButtonType.black:
        return styles.black;
      case ButtonType.white:
        return styles.white;
      case ButtonType.blackBorder:
        return styles.blackBorder;
      case ButtonType.whiteBorder:
        return styles.whiteBorder;
      case ButtonType.blue:
        return styles.blue;
      case ButtonType.edit:
        return styles.editButton;
      case ButtonType.delete:
        return styles.deleteButton;
      case ButtonType.href:
        return styles.hrefButton;
      default:
        return;
    }
  };

  return (
    <div>
      {!isUpdatedButton ? (
        <AntdButton
          className={`${styles.btn} ${styles.light} ${className} ${getStyle(
            btnType
          )}`}
          {...rest}
          onClick={handleButton}
        >
          {text}
          {spinLoading ? <Spin /> : children}
        </AntdButton>
      ) : (
        <div
          className={` ${getStyle(btnType)}`}
          {...rest}
          onClick={handleButton}
        >
          {iconSrc && <Icon src={iconSrc} width={18} height={18} />}
        </div>
      )}
    </div>
  );
}
