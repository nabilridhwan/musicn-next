import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <p>
        This little application is created by{' '}
        <Link href="https://github.com/nabilridhwan">Nabil</Link> and it is{' '}
        <Link href="https://github.com/nabilridhwan/musicn-next">
          open source
        </Link>
        !
      </p>
    </footer>
  );
}
