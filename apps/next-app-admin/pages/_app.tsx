import { AppProps } from 'next/app';
import Layout from 'components/feature/layout';
import { AuthProvider } from 'utils/context/auth/provider';
import { GlobalServices } from 'utils/services/service/globalServices';

import 'antd/dist/antd.css';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <AuthProvider>
      <GlobalServices>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalServices>
    </AuthProvider>
  );
}

export default MyApp;
