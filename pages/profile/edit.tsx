import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import Container from '../../components/Container';
import Section from '../../components/Section';
import { getUserById } from '../../model/users';
import { verifyJWT } from '../../util/jwt';

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

	useEffect(() => {
		if (originalUser != user) {
			setChanged(true);
		} else {
			setChanged(false);
		}
	}, [originalUser, user]);

	console.log(props);

	return (
		<Container>
			<Section>
				{/* Page header */}
				<header className="my-10">
					<h1>Edit Profile</h1>
					<p className="muted">Edit your profile from here!</p>
				</header>

				<form action="/api/login" method="POST">
					<div className="form-group">
						<h2 className="font-bold text-xl">User Details</h2>
					</div>

					<div className="form-group">
						<label htmlFor="Name" className="">
							Name
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
							placeholder="Name"
						/>
					</div>

					<div className="form-group">
						<label htmlFor="username" className="">
							Username
						</label>
						<input
							name="username"
							type="text"
							value={user.username}
							className="form-control"
							id="username"
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

					<div className="form-group">
						<label htmlFor="email">Spotify linked?</label>
						<p>{user.spotify_users ? 'Yes' : 'No'}</p>

						<motion.div
							className="w-fit"
							whileHover={{
								scale: 1.1,
							}}
							whileTap={{
								scale: 0.9,
							}}
						>
							<Link href={``}>
								<a className="bg-spotify shadow-[0px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
									<FaSpotify size={16} />
									Re-link Spotify Account
								</a>
							</Link>
						</motion.div>
					</div>

					<button type="submit" className="btn btn-primary">
						{changed ? 'Save Changes' : 'No Changes to Save'}
					</button>
				</form>
			</Section>
		</Container>
	);
};

export default ProfilePage;
