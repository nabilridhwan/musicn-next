import editProfile, { EditProfileProps } from '@/frontend-api/user/editProfile';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import { SyntheticEvent, useEffect, useState } from 'react';
import * as yup from 'yup';
import Container from '../../components/Container';
import Section from '../../components/Section';
import { getUserById } from '../../model/users';
import { verifyJWT } from '../../util/jwt';
import parseUsername from '../../util/ParseUsername';

export async function getServerSideProps(context: any) {
	// TODO: Check for existing cookies
	const token = getCookie('token', { req: context.req, res: context.res });

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

			const { username, email, name, spotify_users } = user;

			console.log(id);

			return {
				props: {
					username,
					email,
					name,
					spotify_users: {
						...spotify_users,
						id: spotify_users ? Number(spotify_users.id) : null,
						user_id: spotify_users
							? Number(spotify_users.user_id)
							: null,
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

const ProfilePage = ({ ...props }: ProfilePageProps) => {
	const [originalUser, setOriginalUser] = useState(props);
	const [user, setUser] = useState(props);
	const [changed, setChanged] = useState(false);

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [errorMessage, setErrorMessage] = useState('');

	const { data, error, status, isLoading, mutate } = useMutation(
		['edit', user],
		({ username, name, email, password }: EditProfileProps) =>
			editProfile({ username, email, name, password })
	);

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
					data: { message: errors },
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

	async function handleUpdateProfile(e: SyntheticEvent) {
		e.preventDefault();
		setErrorMessage('');

		try {
			const shape = yup.object().shape({
				username: yup.string().required('Username is required'),
				name: yup.string().required('Name is required'),
				email: yup.string().required('Email is required'),
				password: yup.string(),
				confirm_password: yup
					.string()
					.oneOf([yup.ref('password'), null], 'Passwords must match'),
			});

			const validated = await shape.validate({
				username: user.username,
				name: user.name,
				email: user.email,
				password: password,
				confirm_password: confirmPassword,
			});

			// Filter out objects with values in them
			const filtered = Object.entries(validated).filter(
				([key, value]) => value
			);
			const filteredObject = filtered.reduce(
				(acc, [key, value]) => ({ ...acc, [key]: value }),
				{}
			);

			console.log(validated);
			console.log(filteredObject);

			await mutate(filteredObject);
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
		<Container>
			<Section>
				{/* Page header */}
				<header className="my-10">
					<h1>Edit Profile</h1>
					<p className="muted">Edit your profile from here!</p>
				</header>

				<p className="error">{errorMessage}</p>
				<form onSubmit={handleUpdateProfile}>
					<div className="form-group">
						<h2 className="font-bold text-xl">User Details</h2>
					</div>

					<div className="form-group">
						<label htmlFor="name" className="">
							Display Name
						</label>
						<input
							name="name"
							type="text"
							value={decodeURI(user.name)}
							className="form-control"
							id="name"
							onChange={(e) => {
								setUser({ ...user, name: e.target.value });
							}}
							placeholder="Display Name"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="username" className="">
							Username
						</label>

						{user.username !== originalUser.username && (
							<p className="text-sm muted my-2">
								Your username will be saved as:{' '}
								<strong className="text-text">
									@{parseUsername(user.username)}
								</strong>
							</p>
						)}

						<input
							name="username"
							type="text"
							value={user.username}
							className="form-control"
							id="username"
							onBlur={(e) => {
								setUser({
									...user,
									username: parseUsername(e.target.value),
								});
							}}
							onChange={(e) => {
								setUser({ ...user, username: e.target.value });
							}}
							placeholder="Username"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input
							name="email"
							type="email"
							value={user.email}
							className="form-control"
							id="email"
							onChange={(e) => {
								setUser({ ...user, email: e.target.value });
							}}
							placeholder="Email"
						/>
					</div>

					<div className="form-group">
						<h2 className="font-bold text-xl">Password</h2>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							name="password"
							type="password"
							value={password}
							className="form-control"
							id="password"
							onChange={(e) => {
								setPassword(e.target.value);
							}}
							placeholder="Password"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="confirm_password">
							Confirm Password
						</label>
						<input
							name="confirm_password"
							type="password"
							value={confirmPassword}
							className="form-control"
							id="confirm_password"
							onChange={(e) => {
								setConfirmPassword(e.target.value);
							}}
							placeholder="Confirm Password"
						/>
					</div>

					<button
						type="submit"
						className="btn btn-primary"
						disabled={!changed}
					>
						{changed ? 'Save Changes' : 'No Changes to Save'}
					</button>
				</form>

				<Link href="/profile">
					<a className="btn-base bg-red-500">Cancel</a>
				</Link>
			</Section>
		</Container>
	);
};

export default ProfilePage;
