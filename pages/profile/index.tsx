import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
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
		updated_at: string;
	};
};

const ProfilePage = ({ ...props }: ProfilePageProps) => {
	const [originalUser, setOriginalUser] = useState(props);
	const [user, setUser] = useState(props);

	console.log(props);

	return (
		<Container>
			<Section>
				{/* Card if user has no spotify account */}

				{!user.spotify_users.id && <NoSpotifyAccount />}

				{/* Page header */}
				<header className="my-10">
					<h1>Profile</h1>
					<p className="muted">
						Update Profile and do many more things here!
					</p>
				</header>

				<form action="/api/login" method="POST">
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
							placeholder="Name"
							disabled
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
							placeholder="Username"
							disabled
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
							placeholder="Email"
							disabled
						/>
					</div>

					<div className="form-group">
						{user.spotify_users.id && (
							<>
								<p>
									Spotify Linking Last updated:{' '}
									{user.spotify_users.updated_at}
								</p>
								<motion.div
									className="w-fit"
									whileHover={{
										scale: 1.1,
									}}
									whileTap={{
										scale: 0.9,
									}}
								>
									<Link
										href={`/api/link/spotify?redirect=/profile`}
									>
										<a className="bg-spotify shadow-[-1px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
											<FaSpotify size={15} />
											Re-link Spotify Account
										</a>
									</Link>
								</motion.div>

								<motion.div
									className="w-fit"
									whileHover={{
										scale: 1.1,
									}}
									whileTap={{
										scale: 0.9,
									}}
								>
									<Link
										href={`/api/unlink/spotify?redirect=/profile`}
									>
										<a className="bg-red-500 shadow-[0px_0px_20px] shadow-red-500/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
											<IoClose size={16} />
											Unlink Spotify Account
										</a>
									</Link>
								</motion.div>
							</>
						)}
					</div>
				</form>

				<Link href={'/api/logout?redirect=/'}>
					<button type="submit" className="btn bg-red-500">
						Logout
					</button>
				</Link>

				<Link href={'/profile/edit'}>
					<button type="submit" className="btn btn-primary">
						Edit Profile
					</button>
				</Link>
			</Section>
		</Container>
	);
};

function NoSpotifyAccount() {
	return (
		<div className="bg-text text-background rounded-2xl p-5 shadow-lg shadow-text/20">
			<h2 className="font-extrabold text-3xl">👋 Hello there!</h2>
			<p className="text-background/70">
				Your Spotify account isn&apos;t linked yet.{' '}
				<strong>
					For your profile to display, you need to link your Spotify
					account.
				</strong>
			</p>

			<motion.div
				className="w-fit"
				whileHover={{
					scale: 1.05,
				}}
				whileTap={{
					scale: 0.9,
				}}
			>
				<Link href={`/api/link/spotify?redirect=/profile`}>
					<a className="text-text bg-spotify shadow-[-1px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
						<FaSpotify size={15} />
						Link Spotify Account
					</a>
				</Link>
			</motion.div>
		</div>
	);
}

export default ProfilePage;
