import ButtonWithLoading from '@/components/ButtonWithLoading';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import Section from '@/components/Section';
import signup from '@/services/user/signup';
import parseUsername from '@/util/ParseUsername';
import {useMutation} from '@tanstack/react-query';
import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import Signup from '../public/signup.svg';
import Link from 'next/link';
import React, {SyntheticEvent, useEffect, useState} from 'react';
import {FaSpotify} from 'react-icons/fa';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
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
import UserHeader from '@/components/UserHeader';
import Image from 'next/image';
import * as yup from 'yup';
import {useFormik} from 'formik';

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

const SignupPage = () => {
  const {data, error, status, isLoading, mutate} = useMutation(
    ({username, name, email, password, confirm_password}: SignupProps) =>
      signup({username, name, email, password, confirm_password}),
  );

  const [errorMessage, setErrorMessage] = useState('');

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    values,
    setFieldValue,
    setFieldError,
    errors,
    isValid,
    dirty,
    isSubmitting,
    handleSubmit,
  } = useFormik({
    validationSchema,
    initialValues,
    onSubmit: handleSignUp,
  });

  useEffect(() => {
    console.log(status);
    console.log(error);

    if (status === 'success') {
      setErrorMessage('');
      // Redirect to login page
      window.location.href = '/login';
      return;
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

  async function handleSignUp(values: typeof initialValues) {
    setErrorMessage('');

    if (parseUsername(values.username).length === 0) {
      setFieldError(
        'username',
        'Username can only start with a letter and contain letters, numbers, underscores, and dashes.',
      );
      return;
    }

    try {
      await mutate({
        ...values,
        username: parseUsername(values.username),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Container maxW={'container.xl'} my={10}>
      {/* Page header */}

      <SimpleGrid columns={[1, 2]} gap={10}>
        <Center>
          <Box>
            <Image src={Signup} alt={'Sign Up'} width={400} height={400} />
            <Heading>Sign Up</Heading>
            <Text>Signup for a free Musicn account!</Text>
          </Box>
        </Center>

        <Box>
          {errorMessage && (
            <Alert status="error" flexWrap={'wrap'} my={5}>
              <AlertIcon />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap={3} my={5}>
              <Heading fontSize={'2xl'}>Account Details</Heading>

              <Button bg={'green.500'} leftIcon={<FaSpotify />}>
                <Link href={'/api/auth/spotify'}>Sign Up with Spotify</Link>
              </Button>

              <Text textAlign={'center'} fontWeight={'bold'} my={3}>
                OR
              </Text>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={values.email}
                  onChange={e => setFieldValue('email', e.target.value)}
                  placeholder={'johndoe@email.com'}
                />

                <FormErrorMessage>{errors.email}</FormErrorMessage>

                <FormHelperText>
                  We&apos;ll never share your email.
                </FormHelperText>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={values.password}
                  onChange={e => setFieldValue('password', e.target.value)}
                  placeholder={'Password'}
                />

                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirm_password}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={values.confirm_password}
                  onChange={e =>
                    setFieldValue('confirm_password', e.target.value)
                  }
                  placeholder={'Confirm Password'}
                />

                <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>

                <FormHelperText>
                  Just confirming you got the right password!
                </FormHelperText>
              </FormControl>
            </Stack>

            <Divider my={5} />

            <Stack gap={3} my={5}>
              <Heading fontSize={'2xl'}>Profile</Heading>

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Display Name</FormLabel>
                <Input
                  type="text"
                  value={values.name}
                  onChange={e => setFieldValue('name', e.target.value)}
                  placeholder={'John Doe'}
                />

                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={values.username}
                  onChange={e => setFieldValue('username', e.target.value)}
                  placeholder={'johndoe'}
                />

                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <Flex alignItems={'center'} justifyContent={'center'}>
                {username.length > 0 && name.length > 0 && (
                  <Card maxW={'fit-content'} rounded={15} p={5}>
                    <UserHeader
                      username={parseUsername(username)}
                      display_name={name}
                    />
                  </Card>
                )}
              </Flex>
            </Stack>

            <Stack>
              <Button
                isLoading={isSubmitting || isLoading}
                isDisabled={!dirty || !isValid || isSubmitting}
                type={'submit'}
                data-test-id={'signup-button'}>
                Sign Up
              </Button>

              <Text textAlign={'center'}>
                By Signing up, you agree to our{' '}
                <Link href={'/agreement'}>Privacy Policies</Link>
              </Text>
            </Stack>
          </form>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

type PreviewProfileProps = {
  username: string;
  name: string;
};

export default SignupPage;
