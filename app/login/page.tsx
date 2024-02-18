import {getCookie} from 'cookies-next';
import React from 'react';
import * as yup from 'yup';

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
  return <p>Login page in progress</p>;
};

export default LoginPage;
