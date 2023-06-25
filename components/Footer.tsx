import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <p>
        This little application is created by{' '}
        <Link href="https://github.com/nabilridhwan">
          <a className="underline">Nabil</a>
        </Link>{' '}
        and it is{' '}
        <Link href="https://github.com/nabilridhwan/musicn-next">
          <a className="underline">open-source</a>
        </Link>
        !
      </p>
    </footer>
  );
}
