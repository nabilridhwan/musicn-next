import ButtonWithLoading from '@/components/ButtonWithLoading';
import editProfile from '@/frontend-api/user/editProfile';
import {getUserById} from '@/model/users';
import {verifyJWT} from '@/util/jwt';
import parseUsername from '@/util/ParseUsername';
import {useMutation} from '@tanstack/react-query';
import {getCookie} from 'cookies-next';
import Link from 'next/link';
import {SyntheticEvent, useEffect, useState} from 'react';
import * as yup from 'yup';
import {Header} from "@/pages/profile/index";
import {useFormik} from "formik";
import {
    Button, Container,
    Divider,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Stack
} from "@chakra-ui/react";

export async function getServerSideProps(context: any) {
    // TODO: Check for existing cookies
    const token = getCookie('token', {req: context.req, res: context.res});

    if (token) {
        // Decode JWT token
        try {
            const data: any = verifyJWT(token.toString());
            console.log(data);

            const id = data.user_id;

            const user = await getUserById(id);

            if (!user) {
                throw new Error('User not found');
            }

            const {username, email, name, spotify_users} = user;

            console.log(id);

            return {
                props: {
                    username,
                    email,
                    name,
                    spotify_users: {
                        ...spotify_users,
                        id: spotify_users ? Number(spotify_users.id) : null,
                        user_id: spotify_users ? Number(spotify_users.user_id) : null,
                        created_at: spotify_users?.created_at
                            ? new Date(spotify_users.created_at).toISOString()
                            : null,
                        updated_at: spotify_users?.updated_at
                            ? new Date(spotify_users.updated_at).toISOString()
                            : null,
                    },
                    user_id: id,
                },
            };
        } catch (error) {
            return {
                redirect: {
                    destination: '/users',
                    permanent: false,
                },
            };
        }
    }

    return {
        redirect: {
            destination: '/users',
            permanent: false,
        },
    };
}

type ProfilePageProps = {
    user_id: number;
    email: string;
    username: string;
    name: string;
    spotify_users: {
        id: number;
        user_id: number;
        created_at: string;
    };
};

const ProfilePage = ({...props}: ProfilePageProps) => {
    const [originalUser, setOriginalUser] = useState(props);
    const [user, setUser] = useState(props);
    const [changed, setChanged] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const {data, error, status, isLoading, mutate} = useMutation(
        ['edit', user],
        ({username, name, email, password}: EditProfileProps) =>
            editProfile({username, email, name, password}),
    );

    const initialValues = {
        username: user.username ?? "",
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        confirm_password: "",
    }


    const {
        dirty,
        setFieldTouched,
        values,
        setFieldValue,
        touched,
        isSubmitting,
        handleSubmit,
        isValid,
        errors
    } = useFormik({
        initialValues,
        validationSchema: yup.object().shape({
            username: yup.string().required('Username is required'),
            name: yup.string().required('Name is required'),
            email: yup.string().required('Email is required'),
            password: yup.string().oneOf([yup.ref('confirm_password')], 'Passwords must match'),
            confirm_password: yup
                .string()
                .oneOf([yup.ref('password')], 'Passwords must match')
        }),
        onSubmit: handleUpdateProfile,
    })

    useEffect(() => {
        if (status === 'success') {
            // If password changed, log out and redirect to login page
            if (password) {
                window.location.href = '/api/logout?redirect=/login';
            } else {
                window.location.href = '/profile';
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
    }, [status, data, error, password]);

    useEffect(() => {
        if (JSON.stringify(originalUser) !== JSON.stringify(user) || password) {
            setChanged(true);
        } else {
            setChanged(false);
        }
    }, [originalUser, user, password]);

    async function handleUpdateProfile(values: typeof initialValues) {
        setErrorMessage('');

        try {
            await mutate(values);
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                console.log(error.errors);
                setErrorMessage(error.errors.join(', '));
                return;
            }

            setErrorMessage('Something wrong happened');
        }
    }

    return (
        <Container maxW={'container.lg'}>
            {/* Page header */}
            <Header title={"Edit Profile"} lead={"Edit your profile from here!"}/>

            <p className="error">{errorMessage}</p>

            <form onSubmit={handleSubmit}>

                <Stack gap={5}>


                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel>
                            Display Name
                        </FormLabel>

                        <Input
                            type="text"
                            value={decodeURI(values.name)}
                            onChange={e => {
                                setFieldValue('name', e.target.value);
                            }}
                            placeholder="Display Name"
                        />

                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.username}>
                        <FormLabel>
                            Username
                        </FormLabel>

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
                                Your username will be saved as:{' '}
                                @{parseUsername(values.username)}
                            </FormHelperText>
                        )}

                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.email}>
                        <FormLabel>
                            Email
                        </FormLabel>

                        <Input
                            type="text"
                            value={decodeURI(values.email)}
                            onChange={e => {
                                setFieldValue('email', e.target.value);
                            }}
                            placeholder="Email"
                        />

                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <Divider/>

                    <FormControl isInvalid={!!errors.password}>
                        <FormLabel>
                            Password
                        </FormLabel>

                        <Input
                            type="password"
                            value={decodeURI(values.password)}
                            onChange={e => {
                                setFieldValue('password', e.target.value);
                            }}
                            placeholder="Password"
                        />

                        <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirm_password}>
                        <FormLabel>
                            Password
                        </FormLabel>

                        <Input
                            type="password"
                            value={decodeURI(values.confirm_password)}
                            onChange={e => {
                                setFieldValue('confirm_password', e.target.value);
                            }}
                            placeholder="Confirm Password"
                        />

                        <FormErrorMessage>{errors.confirm_password}</FormErrorMessage>
                    </FormControl>

                    <Button
                        type={"submit"}
                        isLoading={isSubmitting}
                        isDisabled={!dirty || !isValid || isSubmitting}
                    >
                        Save
                    </Button>

                    <Button variant={'ghost'}>
                        <Link href="/profile">
                            Cancel
                        </Link>
                    </Button>

                </Stack>
            </form>


        </Container>
    );
};

export default ProfilePage;
