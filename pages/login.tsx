import ButtonWithLoading from '@/components/ButtonWithLoading';
import Container from '@/components/Container';
import Section from '@/components/Section';
import login, { LoginProps } from '@/frontend-api/user/login';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';
import { SyntheticEvent, useEffect, useState } from 'react';
import * as yup from 'yup';

export async function getServerSideProps(context: any) {
	// TODO: Check for existing cookies

	const token = getCookie('token', { req: context.req, res: context.res });

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
	const { data, error, status, isLoading, mutate } = useMutation(
		({ username, password }: LoginProps) => login({ username, password })
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
					data: { message: errors },
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
				{ username, password },
				{ abortEarly: false }
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
		<Container>
			<Section>
				{/* Page header */}
				<header className="my-10">
					<h1>Login</h1>
					<p className="muted">Login into your account</p>
				</header>

				<p className="error">{errorMessage}</p>

				<form onSubmit={handleLogin}>
					<div className="form-group">
						<label htmlFor="username" className="">
							Username or email
						</label>
						<input
							data-test-id="username-input"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							name="username"
							type="text"
							className="form-control"
							id="username"
							placeholder="Enter username or email"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							value={password}
							data-test-id="password-input"
							onChange={(e) => setPassword(e.target.value)}
							name="password"
							type="password"
							className="form-control"
							id="password"
							placeholder="Password"
						/>
					</div>

					<ButtonWithLoading
						data-test-id="login-button"
						text="Log In"
						isLoading={isLoading}
						disabled={!username && !password}
					/>
				</form>
			</Section>
		</Container>
	);
};

export default LoginPage;
