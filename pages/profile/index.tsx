import Container from '@/components/Container';
import PreferencesSection from '@/components/profile/PreferencesSection';
import Section from '@/components/Section';
import getCurrentSongStatus from '@/frontend-api/song/status/getCurrentSongStatus';
import getRecentSongsStatus from '@/frontend-api/song/status/getRecentSongsStatus';
import getTopSongsStatus from '@/frontend-api/song/status/getTopSongsStatus';
import { getUserById } from '@/model/users';
import { verifyJWT } from '@/util/jwt';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import { IoClose, IoPerson } from 'react-icons/io5';

export async function getServerSideProps(context: any) {
	// TODO: Check for existing cookies
	const token = getCookie('token', { req: context.req, res: context.res });

	if (token) {
		// Decode JWT token
		try {
			const data = verifyJWT(token.toString());

			const id = data.user_id;

			const user = await getUserById(id);

			if (!user) {
				throw new Error('User not found');
			}

			const { username, email, name, spotify_users, preferences } = user;

			return {
				props: {
					username,
					email,
					name,
					spotify_users,
					preferences,
					user_id: id,
				},
			};
		} catch (error) {
			console.log(error);
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
			destination: '/login',
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
	preferences: {
		id: number;
		top: boolean;
		account: boolean;
		current: boolean;
		recent: boolean;
		updated_at: string;
	};
};

enum Tabs {
	PROFILE = 'profile',
	PREFERENCES = 'preferences',
	SPOTIFY = 'spotify',
}

const tabs = [
	{
		title: 'Profile',
		enum: Tabs.PROFILE,
	},
	{
		title: 'Preferences',
		enum: Tabs.PREFERENCES,
	},
	{
		title: 'Spotify',
		enum: Tabs.SPOTIFY,
	},
];

const ProfilePage = ({ ...props }: ProfilePageProps) => {
	const [originalUser, setOriginalUser] = useState(props);
	const [user, setUser] = useState(props);

	const [hasSpotify, setHasSpotify] = useState(false);

	const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.PROFILE);

	useEffect(() => {
		if (
			user.hasOwnProperty('spotify_users') &&
			user.spotify_users &&
			(user.spotify_users as any).id
		) {
			setHasSpotify(true);
		}
	}, [user]);

	return (
		<Container>
			<Section>
				{/* Card if user has no spotify account */}

				{!hasSpotify && <NoSpotifyAccount />}

				{/* Tabs */}
				<div className="flex gap-3 mt-10">
					{tabs.map((section, i) => (
						<motion.h2
							key={i}
							onClick={() => {
								setCurrentTab(section.enum);
							}}
							className={`text-xl font-bold mb-5 cursor-pointer ${
								currentTab === section.enum
									? 'text-text'
									: 'muted'
							}`}
						>
							{section.title}

							{currentTab === section.enum && (
								<motion.div
									className="w-100 h-1 rounded-full mt-1"
									layoutId="underline_profile"
									style={{ backgroundColor: 'white' }}
								/>
							)}
						</motion.h2>
					))}
				</div>

				{currentTab === Tabs.PROFILE && (
					<ProfileTab user={user} hasSpotify={hasSpotify} />
				)}

				{currentTab === Tabs.PREFERENCES && (
					<PreferencesSection user={user} />
				)}

				{currentTab === Tabs.SPOTIFY && (
					<SpotifyTab user={user} hasSpotify={hasSpotify} />
				)}
			</Section>
		</Container>
	);
};

function NoSpotifyAccount() {
	return (
		<div className="bg-red-900/30 text-red-500 rounded-2xl p-5 border border-red-500/50">
			<h2 className="font-bold text-2xl">Hello there!👋</h2>
			<p className="text-red-500/80">
				For your profile to be visible and shareable, you need to link
				your Spotify account!
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
				<Link href={`/link`}>
					<a className="text-text bg-spotify shadow-[-1px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
						<FaSpotify size={15} />
						Link Spotify Account
					</a>
				</Link>
			</motion.div>
		</div>
	);
}

export function Header({ title, lead }: { title: string; lead: string }) {
	return (
		<header className="my-10">
			<h2 className="text-3xl font-bold">{title}</h2>
			<p className="muted">{lead}</p>
		</header>
	);
}

function ProfileTab({ user, hasSpotify }: any) {
	return (
		<>
			<Header
				title="Profile"
				lead="Update Profile and do many more things here!"
			/>

			<Link href={`/user/${user.username}`}>
				<a
					data-test-id="musicn-profile-link"
					className="underline flex flex-wrap items-center gap-2 my-3"
				>
					<IoPerson size={16} />
					Click here to go to your Musicn profile
				</a>
			</Link>

			<form action="/api/login" method="POST">
				<div className="form-group">
					<label htmlFor="display_name" className="">
						Display Name
					</label>
					<input
						name="display_name"
						type="text"
						value={decodeURI(user.name)}
						className="form-control"
						id="display_name"
						placeholder="Display Name"
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

				{hasSpotify && (
					<div className="form-group">
						<label htmlFor="musicn_link">Musicn Profile Link</label>

						<input
							name="musicn_link"
							type="text"
							value={`${window.location.origin}/user/${user.username}`}
							className="form-control"
							id="musicn_link"
							placeholder="Musicn Profile Link"
							readOnly
						/>
					</div>
				)}
			</form>

			<Link href={'/profile/edit'}>
				<button type="submit" className="btn btn-primary">
					Edit Profile
				</button>
			</Link>

			<Link href={'/api/logout?redirect=/'}>
				<button type="submit" className="btn bg-red-500">
					Logout
				</button>
			</Link>
		</>
	);
}

function SpotifyTab({ user, hasSpotify }: any) {
	return (
		<>
			<Header
				title="Spotify"
				lead="Check your Spotify data status and re-link or un-link your Spotify account"
			/>
			<div className="form-group">
				{hasSpotify && <StatusCheck user={user} />}
			</div>

			<div className="form-group">
				{hasSpotify && (
					<>
						<label htmlFor="musicn_link">Spotify account</label>
						<p className="muted my-4">
							Last linked:{' '}
							{DateTime.fromISO(
								user.spotify_users.updated_at
							).toRelative()}
						</p>

						<div className="flex gap-3 flex-wrap">
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
									<a className="bg-spotify shadow-[-1px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit flex items-center gap-2">
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
									<a className="bg-red-500 shadow-[0px_0px_20px] shadow-red-500/50 rounded-lg px-4 py-2 w-fit flex items-center gap-2">
										<IoClose size={16} />
										Unlink Spotify Account
									</a>
								</Link>
							</motion.div>
						</div>
					</>
				)}
			</div>

			{!hasSpotify && (
				<div className="form-group">
					<p>No Spotify Account Linked</p>
				</div>
			)}
		</>
	);
}

function StatusCheck({ user }: any) {
	const { status: topStatus, refetch: topRefetch } = useQuery(
		['topStatus', user],
		async () => await getTopSongsStatus(user.username),
		{
			refetchOnMount: true,
			enabled: false,
			retry: 2,
		}
	);

	const { status: recentStatus, refetch: recentRefetch } = useQuery(
		['recentStatus', user],
		async () => await getRecentSongsStatus(user.username),
		{
			refetchOnMount: true,
			enabled: false,
			retry: 2,
		}
	);

	const { status: currentStatus, refetch: currentRefetch } = useQuery(
		['currentStatus', user],
		async () => await getCurrentSongStatus(user.username),

		{ enabled: false, retry: 2, refetchOnMount: true }
	);

	useEffect(() => {
		console.log('Refetch');
		// Fetch all statuses
		topRefetch();
		recentRefetch();
		currentRefetch();
	}, [topRefetch, recentRefetch, currentRefetch]);

	return (
		<div
			id="status"
			className="bg-black text-white-500 rounded-2xl p-5 border border-white/50"
		>
			<h2 className="font-bold text-2xl">Spotify Data Status</h2>
			<p className="opacity-80 text-sm">
				The colors below shows your current Spotify data status.
			</p>

			<div className="flex items-center gap-3 my-3">
				<div
					className={`h-2.5 w-2.5 ${
						currentStatus === 'success'
							? 'bg-green-500'
							: currentStatus === 'loading'
							? 'bg-yellow-500'
							: 'bg-red-500'
					} rounded-lg`}
				/>

				<div>
					<p>Currently Playing Song</p>
					<p className="text-xs opacity-70">
						Status: {currentStatus}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-3 my-3">
				<div
					className={`h-2.5 w-2.5 ${
						topStatus === 'success'
							? 'bg-green-500'
							: currentStatus === 'loading'
							? 'bg-yellow-500'
							: 'bg-red-500'
					} rounded-lg`}
				/>

				<div>
					<p>Top Songs</p>
					<p className="text-xs opacity-70">Status: {topStatus}</p>
				</div>
			</div>

			<div className="flex items-center gap-3 my-3">
				<div
					className={`h-2.5 w-2.5 ${
						recentStatus === 'success'
							? 'bg-green-500'
							: currentStatus === 'loading'
							? 'bg-yellow-500'
							: 'bg-red-500'
					} rounded-lg`}
				/>

				<div>
					<p>Recently Played Songs</p>
					<p className="text-xs opacity-70">Status: {recentStatus}</p>
				</div>
			</div>

			{
				//If any of these statuses is 'error', show the button to refetch
				(currentStatus === 'error' ||
					topStatus === 'error' ||
					recentStatus === 'error') && (
					<>
						<p>Please re-link your Spotify account</p>

						<motion.div
							className="w-fit"
							whileHover={{
								scale: 1.05,
							}}
							whileTap={{
								scale: 0.9,
							}}
						>
							<Link href={`/link`}>
								<a className="text-text bg-spotify shadow-[-1px_0px_20px] shadow-spotify/50 rounded-lg px-4 py-2 w-fit mt-6 flex items-center gap-2">
									<FaSpotify size={15} />
									Link Spotify Account
								</a>
							</Link>
						</motion.div>
					</>
				)
			}
		</div>
	);
}

export default ProfilePage;
