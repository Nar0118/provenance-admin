import NextImage, { ImageProps } from 'next/image';

export default function Image({ ...rest }: ImageProps): JSX.Element {
  return <NextImage draggable="false" {...rest} />;
}
