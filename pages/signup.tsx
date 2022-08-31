import ButtonWithLoading from '@/components/ButtonWithLoading';
import Container from '@/components/Container';
import DefaultProfilePicture from '@/components/DefaultProfilePicture';
import Section from '@/components/Section';
import signup from '@/frontend-api/user/signup';
import styles from '@/styles/UserPage.module.css';
import parseUsername from '@/util/ParseUsername';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SyntheticEvent, useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';

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

const SignupPage = () => {
	const { data, error, status, isLoading, mutate } = useMutation(
		({ username, name, email, password, confirm_password }: SignupProps) =>
			signup({ username, name, email, password, confirm_password })
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
		<Container>
			<Section>
				{/* Page header */}
				<header className="my-10">
					<h1>Sign Up for a Musicn account</h1>
					<p className="muted">Signup for a free Musicn account!</p>
				</header>

				<div className="form-group">
					<label
						htmlFor="username"
						className="text-center text-lg font-bold"
					>
						You profile will look like this:
					</label>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="preview_window"
					>
						<PreviewProfile
							username={parseUsername(username)}
							name={name}
						/>
					</motion.div>
				</div>

				<p className="error">{errorMessage}</p>

				<form onSubmit={handleSignUp}>
					<div className="form-group">
						<label htmlFor="name" className="">
							Display Name
						</label>
						<input
							name="name"
							type="text"
							className="form-control"
							id="name"
							onChange={(e) => setName(e.target.value)}
							placeholder="Display Name"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="username" className="">
							Username
						</label>
						<input
							name="username"
							type="text"
							className="form-control"
							id="username"
							value={username}
							onBlur={(e) =>
								setUsername(parseUsername(e.target.value))
							}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Username"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email" className="">
							Email
						</label>
						<input
							name="email"
							type="text"
							className="form-control"
							id="email"
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							name="password"
							type="password"
							className="form-control"
							id="password"
							onChange={(e) => setPassword(e.target.value)}
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
							className="form-control"
							id="confirm_password"
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Confirm Password"
						/>
					</div>

					<div className="flex items-center justify-center my-10">
						<Link href={'/agreement'}>
							<button
								data-test-id="agreement-button"
								className="text-white border border-white/30 rounded-lg px-4 py-2 w-fit text-xs"
							>
								Important: Click here to read our agreement
							</button>
						</Link>
					</div>

					<ButtonWithLoading
						data-test-id="signup-button"
						text="Sign Up"
						isLoading={isLoading}
						disabled={false}
					/>
				</form>
			</Section>
		</Container>
	);
};

type PreviewProfileProps = {
	username: string;
	name: string;
};

function PreviewProfile({ name, username }: PreviewProfileProps) {
	return (
		<div
			className={
				styles.section + ' flex items-center justify-center gap-5'
			}
		>
			<DefaultProfilePicture />

			<div>
				{/* Name */}
				<h2 className={styles.name + ' break-all'}>
					{name ? name.slice(0, 30) : 'Display Name'}
				</h2>

				{/* Username */}
				<p className="text-sm text-text/70">
					{username ? `@${username.slice(0, 30)}` : '@username'}
				</p>

				{/* Spotify link */}
				<button className="cursor-pointer flex items-center w-min gap-1 bg-spotify p-2 px-4 rounded-lg my-2">
					<FaSpotify />
					Spotify
				</button>
			</div>
		</div>
	);
}

export default SignupPage;
