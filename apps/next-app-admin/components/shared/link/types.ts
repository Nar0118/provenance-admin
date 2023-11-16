import { LinkProps } from 'next/link';

export default interface CustomLinkProps extends LinkProps {
  text: string;
  color?: string;
}
