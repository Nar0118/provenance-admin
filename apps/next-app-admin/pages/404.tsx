import Error from 'next/error';

export default function NotFound(): JSX.Element {
  return <Error statusCode={404} />;
}
