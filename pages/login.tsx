import ButtonWithLoading from '@/components/ButtonWithLoading';
import login, {LoginProps} from '@/services/user/login';
import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {getCookie} from 'cookies-next';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import * as yup from 'yup';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import LoginImage from '../public/login.svg';
import Image from 'next/image';
import {Formik, useFormik} from 'formik';
import KnownClientErrorMessage from '@/components/KnownClientErrorMessage';

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

export async function getServerSideProps(context: any) {
  // TODO: Check for existing cookies

  const token = getCookie('token', {req: context.req, res: context.res});

  if (token) {
    // Redirect to profile page
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const LoginPage = () => {
  const {data, error, status, isLoading, mutate} = useMutation(
    ({username, password}: LoginProps) => login({username, password}),
  );

  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const {
    isValid,
    dirty,
    values,
    setFieldValue,
    errors,
    isSubmitting,
    handleSubmit,
  } = useFormik<typeof initialValues>({
    validationSchema,
    initialValues,
    onSubmit: handleLogin,
  });

  useEffect(() => {
    if (status === 'success') {
      setErrorMessage('');

      console.log(data);

      // If user has not linked their account, redirect them to /link otherwise redirect them to /profile

      if (!data.spotify_users || !data.spotify_users.id) {
        // Redirect to link page
        window.location.href = '/link';
        return;
      } else {
        // Redirect to profile page
        window.location.href = '/profile';
        return;
      }
    }

    if (status === 'error') {
      console.log(error);
      const {
        response: {
          data: {message: errors},
        },
      } = error as any;

      if (Array.isArray(errors)) {
        setErrorMessage(errors.join(', '));
      } else {
        setErrorMessage(errors);
      }
    }
  }, [status, error]);

  async function handleLogin(values: typeof initialValues) {
    setErrorMessage('');

    try {
      await mutate(values);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrorMessage(err.errors.join(', '));
        return;
      }

      if (err instanceof AxiosError) {
        console.log(err);
        setErrorMessage(err.message);
        return;
      }

      setErrorMessage('Something went wrong');
    }
  }

  return (
    <Container maxW={'container.xl'} my={50}>
      <SimpleGrid columns={[1, 2]} gap={10}>
        <Center>
          <Stack textAlign={'right'} gap={10}>
            <Image
              src={LoginImage}
              width={300}
              height={300}
              alt={'Login Illustration'}
            />

            <Box>
              {/* Page header */}
              <Heading>Login</Heading>
              <Text>Login into your account</Text>
            </Box>
          </Stack>
        </Center>

        <Box flex={1}>
          {errorMessage && (
            <Alert status="error" flexWrap={'wrap'} my={5}>
              <AlertIcon />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <KnownClientErrorMessage />

          <form onSubmit={handleSubmit}>
            <Stack gap={5}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="text"
                  value={values.username}
                  disabled={isSubmitting && !dirty}
                  onChange={e => setFieldValue('username', e.target.value)}
                  placeholder={'johndoe@email.com'}
                />

                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={values.password}
                  disabled={isSubmitting && !dirty}
                  onChange={e => setFieldValue('password', e.target.value)}
                  placeholder={'Password'}
                />

                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <Button
                type={'submit'}
                data-test-id={'login-button'}
                isLoading={isLoading}
                isDisabled={!isValid || !dirty || isSubmitting}>
                Log In
              </Button>
            </Stack>
          </form>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default LoginPage;
