import { Modal as AntdModal } from 'antd/lib';
import { ModalProps } from './types';

export default function Modal({
  children,
  isModalVisible,
  onCancel,
  className,
  ...rest
}: ModalProps): JSX.Element {
  return (
    <AntdModal
      className={className}
      visible={isModalVisible}
      onCancel={onCancel}
      footer={null}
      {...rest}
    >
      {children}
    </AntdModal>
  );
}
