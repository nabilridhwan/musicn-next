import ButtonWithLoading from '@/components/ButtonWithLoading';
import login, {LoginProps} from '@/frontend-api/user/login';
import {useMutation} from '@tanstack/react-query';
import {AxiosError} from 'axios';
import {getCookie} from 'cookies-next';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import * as yup from 'yup';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import LoginImage from '../public/login.svg';
import Image from 'next/image';

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

  useEffect(() => {
    if (status === 'success') {
      setErrorMessage('');

      console.log(data);

      // If user has no linked their account, redirect them to /link otherwise redirect them to /profile

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

  async function handleLogin(e: SyntheticEvent) {
    e.preventDefault();
    setErrorMessage('');

    const shape = yup.object({
      username: yup.string().required('Username or email is required'),
      password: yup.string().required('Password is required'),
    });

    try {
      const validated = await shape.validate(
        {username, password},
        {abortEarly: false},
      );
      await mutate(validated);
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
      <HStack gap={10}>
        <Stack flex={1} textAlign={'right'} gap={10}>
          <Image
            src={LoginImage}
            width={500}
            height={500}
            alt={'Login Illustration'}
          />

          <Box>
            {/* Page header */}
            <Heading>Login</Heading>
            <Text>Login into your account</Text>
          </Box>
        </Stack>

        <Box flex={1}>
          <p className="error">{errorMessage}</p>

          <form onSubmit={handleLogin}>
            <Stack gap={5}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={'johndoe@email.com'}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={'Password'}
                />
              </FormControl>

              <Button
                onClick={handleLogin}
                data-test-id={'login-button'}
                isLoading={isLoading}
                disabled={!username && !password}>
                Log In
              </Button>
            </Stack>
          </form>
        </Box>
      </HStack>
    </Container>
  );
};

export default LoginPage;
