import Head from 'next/head';
import NavigationBar from '@/components/NavigationBar';
import '../globals.css';
import Providers from '@/providers';

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Musicn - Discover what other people are listening to</title>
      </Head>
      <body>
        <Providers>
          {/* @ts-expect-error Server Component */}
          <NavigationBar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
