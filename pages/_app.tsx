import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';

// Progress bar: https://stackoverflow.com/a/60755417
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import NavigationBar from '../components/NavigationBar';
import MusicPreviewDialogProvider from '../context/MusicPreviewDialogProvider';

NProgress.configure({
	minimum: 0.3,
	easing: 'ease',
	speed: 500,
	showSpinner: false,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: true,
			refetchOnReconnect: true,
			refetchOnWindowFocus: true,
		},
	},
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>
					Musicn - Discover what other people are listening to
				</title>
			</Head>
			<QueryClientProvider client={queryClient}>
				<MusicPreviewDialogProvider>
					<NavigationBar />
					<Component {...pageProps} />
					{/* <Footer /> */}
				</MusicPreviewDialogProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</>
	);
}

export default MyApp;
