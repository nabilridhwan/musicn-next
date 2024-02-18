import {getCookie} from 'cookies-next';
import React from 'react';
import * as yup from 'yup';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {generateState, Spotify} from 'arctic';
import Link from 'next/link';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .email('Please type in a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

// export async function getServerSideProps(context: any) {
//   // TODO: Check for existing cookies
//
//   const token = getCookie('token', {req: context.req, res: context.res});
//
//   if (token) {
//     // Redirect to profile page
//     return {
//       redirect: {
//         destination: '/profile',
//         permanent: false,
//       },
//     };
//   }
//
//   return {
//     props: {},
//   };
// }

const LoginPage = () => {
  const cookieStorage = cookies();

  if (cookieStorage.get('token')) {
    redirect('/profile');
  }

  return (
    <div>
      <Link href={'/api/login'}>
        <Button>Login with Spotify</Button>
      </Link>
    </div>
  );
};

export default LoginPage;
