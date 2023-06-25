import ButtonWithLoading from '@/components/ButtonWithLoading';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import Section from '@/components/Section';
import signup from '@/frontend-api/user/signup';
import parseUsername from '@/util/ParseUsername';
import {useMutation} from '@tanstack/react-query';
import {getCookie} from 'cookies-next';
import {motion} from 'framer-motion';
import Signup from '../public/signup.svg';
import Link from 'next/link';
import {SyntheticEvent, useEffect, useState} from 'react';
import {FaSpotify} from 'react-icons/fa';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
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
import UserCard from '@/components/UserCard';
import Image from 'next/image';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  username: yup.string().required('Username is required'),
  name: yup.string().required('Name is required'),
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

  const handleSignUp = async (e: SyntheticEvent) => {
    e.preventDefault();

    setErrorMessage('');

    try {
      await mutate({
        username: parseUsername(username),
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container maxW={'container.xl'} my={10}>
      {/* Page header */}

      <HStack gap={10}>
        <Box flex={1}>
          <Image src={Signup} alt={'Sign Up'} width={400} height={400} />
          <Heading>Sign Up</Heading>
          <Text>Signup for a free Musicn account!</Text>
        </Box>

        <Box flex={2}>
          <form onSubmit={handleSignUp}>
            <Stack gap={3} my={5}>
              <Heading fontSize={'2xl'}>Account Details</Heading>

              <FormControl>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={'johndoe@email.com'}
                />
                <FormHelperText>
                  We&apos;ll never share your email.
                </FormHelperText>
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

              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={'Confirm Password'}
                />

                <FormHelperText>
                  Just confirming you got the right password!
                </FormHelperText>
              </FormControl>
            </Stack>

            <Divider my={5} />

            <Stack gap={3} my={5}>
              <Heading fontSize={'2xl'}>Profile</Heading>

              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={'John Doe'}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={'johndoe'}
                />
              </FormControl>

              {username.length > 0 && name.length > 0 && (
                <Card maxW={'fit-content'} rounded={15} p={5}>
                  <UserCard
                    username={parseUsername(username)}
                    display_name={name}
                  />
                </Card>
              )}
            </Stack>

            <Stack>
              <Button isLoading={isLoading} data-test-id={'signup-button'}>
                Sign Up
              </Button>

              <button
                data-test-id="agreement-button"
                className="text-white border border-white/30 rounded-lg px-4 py-2 w-fit text-xs">
                By Signing up, you agree to our{' '}
                <Link href={'/agreement'}>Privacy Policies</Link>
              </button>
            </Stack>
          </form>
        </Box>
      </HStack>
    </Container>
  );
};

type PreviewProfileProps = {
  username: string;
  name: string;
};

export default SignupPage;
