'use client';

import parseUsername from '@/util/ParseUsername';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useToast} from '@/components/ui/use-toast';
import Header from '@/components/profile/Header';
import {getMe} from '@/api/getMe';
import {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {redirect} from 'next/navigation';
import {Button} from '@/components/ui/button';

type User = Awaited<ReturnType<typeof getMe>>;

const initialValues = {
  username: '',
  name: '',
};

const ProfilePage = () => {
  const {toast} = useToast();
  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    axios.get('/api/me').then(res => {
      console.log(res.data);

      setUser(res.data);

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
    // setErrorMessage('');
    //
    // try {
    //     await mutate(values);
    // } catch (error) {
    //     if (error instanceof yup.ValidationError) {
    //         console.log(error.errors);
    //         setErrorMessage(error.errors.join(', '));
    //         return;
    //     }
    //
    //     setErrorMessage('Something wrong happened');
    // }
  }

  return (
    <div>
      {/* Page header */}
      <Header title={'Edit Profile'} lead={'Edit your profile from here!'} />

      {/*<p className="error">{errorMessage}</p>*/}

      <form onSubmit={handleSubmit}>
        <div className={'space-y-5'}>
          <label>Display Name</label>
          <input
            type="text"
            value={decodeURI(values.name)}
            onChange={e => {
              setFieldValue('name', e.target.value);
            }}
            placeholder="Display Name"
          />

          <label>Username</label>
          <input
            type="text"
            value={decodeURI(values.username)}
            onChange={e => {
              setFieldValue('username', e.target.value);
            }}
            onFocusCapture={() => setFieldTouched('username', true, true)}
            placeholder="Username"
          />

          {touched.username && (
            <label>
              Your username will be saved as: @{parseUsername(values.username)}
            </label>
          )}

          <Button
            type={'submit'}
            disabled={!dirty || !isValid || isSubmitting || isTheSame}>
            Save
          </Button>
        </div>
      </form>

      <Button variant={'destructive'}>Delete Account</Button>
    </div>
  );
};

export default ProfilePage;
