import Head from 'next/head';
import '/styles/nprogress.css';
import { useRouter } from 'next/router';
import { useEffect, createContext, useState } from 'react';
import NProgress from 'nprogress';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CookiesProvider } from 'react-cookie';

export const AuthorizationContext = createContext(null);

export default function MyApp({ Component, pageProps }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const toggleAuthorization = () => setIsAuthorized((isAuthorized) => !isAuthorized);

  const router = useRouter();

  // Отрисовывает индикатор загрузки страницы в правом нижнем углу
  useEffect(() => {
    const handleStart = () => {
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

  // Устанавливаем тему для Material UI
  const theme = createTheme({
    palette: {
      primary: {
        main: '#262626',
      },
      secondary: {
        main: '#606060',
      },
    },
  });

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <title>NextJS App</title>
      </Head>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthorizationContext.Provider value={{ isAuthorized, toggleAuthorization }}>
            <Component {...pageProps} />
          </AuthorizationContext.Provider>
        </ThemeProvider>
      </CookiesProvider>
    </>
  );
}
