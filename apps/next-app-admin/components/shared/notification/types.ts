import { ArgsProps } from 'antd/lib/notification';

type NotificationTypes =
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'warn'
  | 'open'
  | 'close'
  | 'destroy';

export interface NotificationProps extends ArgsProps {
  messageType: NotificationTypes;
}
