import Head from 'next/head';
import '/styles/global.scss';
import '/styles/nprogress.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NProgress from 'nprogress';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`);
      NProgress.start();
    };
    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>NextJS App</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
