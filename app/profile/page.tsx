'use client';

import parseUsername from '@/util/ParseUsername';
import * as yup from 'yup';
import {useFormik} from 'formik';
import Header from '@/components/profile/Header';
import {getMe} from '@/api/getMe';
import {useMemo, useState} from 'react';
import axios from 'axios';
import {redirect} from 'next/navigation';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spacer,
  Stack,
  Switch,
  useToast,
} from '@chakra-ui/react';
import {getSessionInformation} from '@/api/getSessionInformation';
import {useLayoutEffect} from '@radix-ui/react-use-layout-effect';
import {Heading3} from 'lucide-react';

type User = Awaited<ReturnType<typeof getMe>>;

const initialValues = {
  username: '',
  name: '',
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPreferences, setUserPreferences] = useState<
    User['preferences'] | null
  >({
    account: false,
    current: false,
    recent: false,
    top: false,
  });

  const toast = useToast();
  // const sessionInformation = await getSessionInformation();

  // const [originalUser, setOriginalUser] = useState(props);
  // const [user, setUser] = useState(props);
  // const [changed, setChanged] = useState(false);
  //
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  //
  // const [errorMessage, setErrorMessage] = useState('');
  //
  // const {data, error, status, isLoading, mutate} = useMutation(
  //     ['edit', user],
  //     ({username, name, email, password}: EditProfileProps) =>
  //         editProfile({username, email, name, password}),
  // );
  //

  useLayoutEffect(() => {
    axios.get('/api/me').then(res => {
      console.log(res.data);

      setUser(res.data);
      setUserPreferences(res.data.preferences);
      setFieldValue('username', res.data.username, false);
      setFieldValue('name', res.data.name, false);
    });
  }, []);

  const {
    dirty,
    setFieldTouched,
    values,
    setFieldValue,
    touched,
    isSubmitting,
    handleSubmit,
    isValid,
    errors,
  } = useFormik({
    initialValues,
    validationSchema: yup.object().shape({
      username: yup.string().required('Username is required'),
      name: yup.string().required('Name is required'),
    }),
    onSubmit: handleUpdateProfile,
  });

  const isTheSame = useMemo(() => {
    return user?.username === values.username && user?.name === values.name;
  }, [user, values]);

  async function handleUpdateProfile(values: typeof initialValues) {
    values.username = parseUsername(values.username);
    axios
      .put('/api/me', values)
      .then(res => {
        console.log(res);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully!',
        });
      })
      .catch(err => {
        console.error(err);
        toast({
          title: 'Error',
          description:
            'An error occurred while updating your profile: ' + err.message,
        });
      });
  }

  async function handleUpdatePreferences(values: {
    account: boolean;
    top: boolean;
    current: boolean;
    recent: boolean;
  }) {
    axios
      .put('/api/me/preferences', values)
      .then(res => {
        console.log(res);
        toast({
          title: 'Visiblity updated',
          description:
            'Your visibility settings have been updated successfully!',
        });
      })
      .catch(err => {
        console.error(err);
        toast({
          title: 'Error',
          description:
            'An error occurred while updating your visibility: ' + err.message,
        });
      });
  }

  return (
    <Container maxW={'6xl'} px={5}>
      {/*<p>{JSON.stringify(user, null, 2)}</p>*/}

      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxW={'fit-content'}
        py={5}
        mx={'auto'}
        rounded={'2xl'}>
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Spotify accounts are now the only way to sign up/login
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          As of February 19, 2024, Musicn now requires logging in/signing up
          through Spotify accounts. Email/password login is no longer available.
          Your Musicn account is tied to your Spotify account, and unlinking is
          not possible.
        </AlertDescription>
      </Alert>

      {/* Page header */}
      <Header title={'Edit Profile'} lead={'Edit your profile from here!'} />

      {/*<p className="error">{errorMessage}</p>*/}

      <Stack>
        <Box
          border={'1px solid'}
          borderColor={'whiteAlpha.300'}
          rounded={'xl'}
          p={6}>
          <Heading size={'lg'}>Appearance</Heading>
          <form onSubmit={handleSubmit}>
            <Stack>
              <FormControl>
                <FormLabel>Display Name</FormLabel>
                <Input
                  type="text"
                  value={decodeURI(values.name)}
                  onChange={e => {
                    setFieldValue('name', e.target.value);
                  }}
                  placeholder="Display Name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={decodeURI(values.username)}
                  onChange={e => {
                    setFieldValue('username', e.target.value);
                  }}
                  onFocusCapture={() => setFieldTouched('username', true, true)}
                  placeholder="Username"
                />

                {touched.username && (
                  <FormHelperText>
                    Your username will be saved as: @
                    {parseUsername(values.username)}
                  </FormHelperText>
                )}
              </FormControl>

              <HStack>
                <Button
                  flex={1}
                  type={'submit'}
                  disabled={!dirty || !isValid || isSubmitting || isTheSame}>
                  Save
                </Button>

                <Button type={'button'} flex={1} colorScheme={'red'}>
                  Delete Account
                </Button>
              </HStack>
            </Stack>
          </form>
        </Box>

        <Box
          border={'1px solid'}
          borderColor={'whiteAlpha.300'}
          rounded={'xl'}
          p={6}>
          <Heading size={'lg'}>Visibility</Heading>

          <Stack my={5}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Show my profile publicly
              </FormLabel>

              <Spacer />
              <Switch
                id="email-alerts"
                isChecked={userPreferences.account || false}
                onChange={e => {
                  setUserPreferences({
                    ...userPreferences,
                    account: e.target.checked,
                  });
                }}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Show my top songs
              </FormLabel>

              <Spacer />
              <Switch
                id="email-alerts"
                isChecked={userPreferences.top || false}
                onChange={e => {
                  setUserPreferences({
                    ...userPreferences,
                    top: e.target.checked,
                  });
                }}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Show my recently listened songs
              </FormLabel>

              <Spacer />
              <Switch
                id="email-alerts"
                isChecked={userPreferences.recent || false}
                onChange={e => {
                  setUserPreferences({
                    ...userPreferences,
                    recent: e.target.checked,
                  });
                }}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-alerts" mb="0">
                Show my currently playing song
              </FormLabel>

              <Spacer />
              <Switch
                id="email-alerts"
                onChange={e => {
                  setUserPreferences({
                    ...userPreferences,
                    current: e.target.checked,
                  });
                }}
                isChecked={userPreferences.current || false}
              />
            </FormControl>
          </Stack>

          <Button
            onClick={() => {
              handleUpdatePreferences(userPreferences);
            }}>
            Save
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
