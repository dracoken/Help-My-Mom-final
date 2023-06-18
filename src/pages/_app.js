import { SWRConfig } from 'swr'
import fetchJson from '@/lib/fetchJson'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
      <SWRConfig
          value={{
              fetcher: fetchJson,
              onError: (err) => {
                  console.error(err);
              },
          }}
      >
          {getLayout(<Component {...pageProps} />)}
      </SWRConfig>
  );
}
