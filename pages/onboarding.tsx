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
import UserHeader from '@/components/user/UserHeader';
import Image from 'next/image';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useRouter} from 'next/router';
import {NextPageContext} from 'next';

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
  password: '',
  confirm_password: '',
};

export async function getServerSideProps(context: NextPageContext) {
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

interface OnboardingDecodedData {}

const SignupPage = () => {
  const {query} = useRouter();

  // _d is the data object
  const {_d: data} = query;

  // Decode the data
  const [errorMessage, setErrorMessage] = useState('');

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
    onSubmit: handleOnboarding,
  });

  async function handleOnboarding(values: typeof initialValues) {
    setErrorMessage('');

    try {
      console.log(values);
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
            <Heading>One Last Thing</Heading>
            <Text>
              Set up your account with a password. The next time you log in,
              you&apos;ll use the password.
            </Text>
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
              <Heading fontSize={'2xl'}>Password</Heading>
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

            <Stack>
              <Button
                // isLoading={isSubmitting || isLoading}
                isDisabled={!dirty || !isValid || isSubmitting}
                type={'submit'}
                data-test-id={'signup-button'}>
                Continue
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
