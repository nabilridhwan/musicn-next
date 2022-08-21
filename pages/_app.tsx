import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

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
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}

export default MyApp;
