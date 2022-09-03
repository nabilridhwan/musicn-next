import ButtonWithLoading from '@/components/ButtonWithLoading';
import Container from '@/components/Container';
import Section from '@/components/Section';
import updatePreferences from '@/frontend-api/user/updatePreferences';
import { getUserById } from '@/model/users';
import { verifyJWT } from '@/util/jwt';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { SyntheticEvent, useEffect, useState } from 'react';
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

			console.log(id);

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

const ProfilePage = ({ ...props }: ProfilePageProps) => {
	const [originalUser, setOriginalUser] = useState(props);
	const [user, setUser] = useState(props);

	const [hasSpotify, setHasSpotify] = useState(false);
	const [hasPreferences, setHasPreferences] = useState(false);
	const [preferenceChanged, setPreferenceChanged] = useState(false);

	const [originalAccount, setOriginalAccount] = useState(true);
	const [originalTop, setOriginalTop] = useState(true);
	const [originalCurrent, setOriginalCurrent] = useState(true);
	const [originalRecent, setOriginalRecent] = useState(true);

	const [account, setAccount] = useState(true);
	const [top, setTop] = useState(true);
	const [current, setCurrent] = useState(true);
	const [recent, setRecent] = useState(true);

	const {
		status: updateStatus,
		error: updateError,
		mutateAsync: updatePreferencesAsync,
	} = useMutation(
		['updatePreference', user],
		async (obj: Preferences) => await updatePreferences(obj)
	);

	useEffect(() => {
		if (
			user.hasOwnProperty('spotify_users') &&
			user.spotify_users &&
			(user.spotify_users as any).id
		) {
			setHasSpotify(true);
		}

		if (
			user.hasOwnProperty('preferences') &&
			user.preferences &&
			(user.preferences as any).id
		) {
			setHasPreferences(true);

			const { top, current, recent, account } = user.preferences;

			setOriginalAccount(account);
			setOriginalTop(top);
			setOriginalCurrent(current);
			setOriginalRecent(recent);

			setAccount(account);
			setTop(top);
			setCurrent(current);
			setRecent(recent);
		}
	}, [user]);

	useEffect(() => {
		// One of the preferences change
		if (
			top !== originalTop ||
			current !== originalCurrent ||
			recent !== originalRecent
		) {
			setPreferenceChanged(true);
		} else {
			setPreferenceChanged(false);
		}
	}, [top, current, recent, originalTop, originalCurrent, originalRecent]);

	useEffect(() => {
		if (updateStatus === 'success') {
			setOriginalCurrent(current);
			setOriginalRecent(recent);
			setOriginalTop(top);
		}
	}, [updateStatus, current, recent, top]);

	async function handlePreferenceUpdate(e: SyntheticEvent) {
		e.preventDefault();
		await updatePreferencesAsync({ top, recent, current, account });
	}

	return (
		<Container>
			<Section>
				{/* Card if user has no spotify account */}

				{!hasSpotify && <NoSpotifyAccount />}

				{/* Page header */}
				<header className="my-10">
					<h1>Profile</h1>
					<p className="muted">
						Update Profile and do many more things here!
					</p>
				</header>

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
							<label htmlFor="musicn_link">
								Musicn Profile Link
							</label>

							<Link href={`/user/${user.username}`}>
								<a
									data-test-id="musicn-profile-link"
									className="underline flex flex-wrap items-center gap-2 my-3"
								>
									<IoPerson size={16} />
									Click here to go to your Musicn profile
								</a>
							</Link>

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

					<div className="form-group">
						<label htmlFor="Preferences">Preferences</label>

						{updateStatus === 'success' && (
							<div className="alert alert-success">
								Preferences updated successfully!
							</div>
						)}

						{hasPreferences && (
							<p className="muted my-2">
								Last changed:{' '}
								{DateTime.fromISO(
									user.preferences.updated_at
								).toRelative()}
							</p>
						)}

						<label htmlFor="account">Account</label>
						<input
							type="checkbox"
							id="account"
							onChange={() => setAccount(!account)}
							checked={account}
						/>

						<label htmlFor="top">Top Songs</label>
						<input
							type="checkbox"
							id="top"
							onChange={() => setTop(!top)}
							checked={top}
						/>

						<label htmlFor="Recently Played Songs">
							Recently Played Songs
						</label>
						<input
							type="checkbox"
							id="Recently Played Songs"
							onChange={() => setRecent(!recent)}
							checked={recent}
						/>

						<label htmlFor="Currently Playing Song">
							Currently Playing Song
						</label>
						<input
							type="checkbox"
							id="Currently Playing Song"
							onChange={() => setCurrent(!current)}
							checked={current}
						/>

						<ButtonWithLoading
							disabled={updateStatus === 'loading'}
							isLoading={updateStatus === 'loading'}
							onClick={handlePreferenceUpdate}
							text="Update Preferences"
						/>
					</div>

					<div className="form-group">
						{hasSpotify && (
							<>
								<label htmlFor="musicn_link">
									Spotify account
								</label>
								<p className="muted my-2">
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
			</Section>
		</Container>
	);
};

function NoSpotifyAccount() {
	return (
		<div className="bg-red-900/30 text-red-500 rounded-2xl p-5 border border-red-500/50">
			<h2 className="font-bold text-2xl">Hello there!👋</h2>
			<p className="text-red-500/80">
				For your profile to be accessible, you need to link your Spotify
				account.
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

export default ProfilePage;
