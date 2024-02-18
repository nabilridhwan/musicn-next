import {getCookie} from 'cookies-next';
import Signup from '../../public/signup.svg';
import React from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .oneOf([yup.ref('confirm_password')], 'Passwords must match'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  username: yup.string().required('Username is required'),
  name: yup.string().required('Display Name is required'),
});

const initialValues = {
  email: '',
  password: '',
  confirm_password: '',
  username: '',
  name: '',
};

// export async function getServerSideProps(context: any) {
//   // TODO: Check for existing cookies
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

const SignupPage = () => {
  return <h1>Signup page in progress...</h1>;
};

type PreviewProfileProps = {
  username: string;
  name: string;
};

export default SignupPage;
