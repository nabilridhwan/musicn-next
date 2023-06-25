import MusicPreviewDialog from '@/components/MusicPreviewDialog';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import type {AppProps} from 'next/app';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';

import Head from 'next/head';
import Router from 'next/router';
import {useContext} from 'react';
import NavigationBar from '../components/NavigationBar';
import MusicPreviewDialogProvider, {
  MusicPreviewDialogContext,
} from '../context/MusicPreviewDialogProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

const theme = extendTheme({
  colors: {
    primary: {
      400: '#90cdf4',
      500: '#bee3f8',
    },
    secondary: {
      400: '#90cdf4',
      500: '#ebf1ff',
    },
    accent: {500: '#fed7e2'},
  },

  components: {
    Card: {
      baseStyle: {
        borderRadius: 10,
        bg: 'gray.700',
      },

      defaultProps: {
        variant: 'sm', // default is solid
        colorScheme: 'green', // default is gray
        _hover: {
          shadow: 'lg',
          shadowColor: 'gray.100',
        },
      },
    },

    // Button: {
    //     baseStyle: {
    //         bg: 'secondary.500'
    //     },
    //     variants: {
    //         'primary': {
    //             bg: 'secondary.500',
    //             color: 'gray.900',
    //
    //             _hover: {
    //                 bg: 'secondary.400',
    //                 color: 'gray.900',
    //             }
    //         },
    //         'accent': {
    //             bg: 'accent.500',
    //             color: 'gray.900',
    //         }
    //     },
    //     defaultProps: {
    //         variant: 'primary',
    //     }
    // }
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: 'gray.900',
        color: 'gray.100',
      },
      // styles for the `a`
      a: {
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
});

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>Musicn - Discover what other people are listening to</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <MusicPreviewDialogProvider>
          <ChakraProvider theme={theme}>
            <NavigationBar />
            <Component {...pageProps} />
            <MPD_Wrapper />
            {/* <Footer /> */}
          </ChakraProvider>
        </MusicPreviewDialogProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

function MPD_Wrapper() {
  const {hideSongPreview} = useContext(MusicPreviewDialogContext);
  return (
    <>
      {/* TODO: Show actual volume */}
      <MusicPreviewDialog handleClose={hideSongPreview} />
    </>
  );
}

export default MyApp;
