import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import Container from '../../components/Container';
import DefaultProfilePicture from '../../components/DefaultProfilePicture';
import {
	MusicPlayer,
	MusicPlayerError,
	MusicPlayerNotPlaying,
} from '../../components/MusicPlayer';
import Section from '../../components/Section';
import ShareButton from '../../components/ShareButton';
import SongCard from '../../components/SongCard';
import getCurrentSong from '../../fe_controller/song/getCurrentSong';
import getSpotifyUserDetails, {
	SpotifyUserDetails,
} from '../../fe_controller/song/getSpotifyUserDetails';
import getTopSongs from '../../fe_controller/song/getTopSongs';
import getUserDetails from '../../fe_controller/song/getUserDetails';
import styles from '../../styles/UserPage.module.css';

type UsersProps = {
	user: any;
	spotify: SpotifyUserDetails;
	top: any;
};

export async function getServerSideProps(context: any) {
	const { username } = context.query;

	try {
		let user, top, spotify;

		let userPromise = getUserDetails(username);
		let topPromise = getTopSongs(username);
		let spotifyPromise = getSpotifyUserDetails(username);

		const promiseResults = await Promise.all([
			userPromise,
			topPromise,
			spotifyPromise,
		]);

		user = promiseResults[0];
		top = promiseResults[1];
		spotify = promiseResults[2];

		if (!user.spotify_users) {
			throw new Error('No spotify user found');
		}

		return {
			props: {
				user,
				top,
				spotify,
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

const UserPage = ({ user, top, spotify }: UsersProps) => {
	const [imageLoadError, setImageLoadError] = useState(false);
	// const {
	// 	data: recentSongsData,
	// 	isLoading: isRecentSongsLoading,
	// 	isError: isRecentSongsError,
	// 	isSuccess: isRecentSongsSuccess,
	// 	status: recentSongsStatus,
	// } = useQuery(
	// 	['recentSongs', user.username],
	// 	async () => await getRecentSongs(user.username)
	// );

	const {
		data: currentSongData,
		isLoading: isCurrentSongLoading,
		isError: isCurrentSongError,
		isSuccess: isCurrentSongSuccess,
		status: currentSongStatus,
	} = useQuery(
		['currentSongs', user.username],
		async () => await getCurrentSong(user.username),
		{ retry: 2 }
	);

	// const {
	// 	data: topSongsData,
	// 	isLoading: isTopSongsLoading,
	// 	isError: isTopSongsError,
	// 	isSuccess: isTopSongsSuccess,
	// 	status: topSongsStatus,
	// } = useQuery(
	// 	['topSongs', user.username],
	// 	async () => await getTopSongs(user.username),
	// 	{ onSuccess: (d) => console.log(d) }
	// );

	return (
		<>
			<Head>
				<title>{decodeURI(user.username)}&apos;s Profile</title>

				<meta
					name="description"
					content={`Check out my profile! My top songs are ${top
						.slice(0, 3)
						.map((song: any) => song.name)
						.join(', ')}`}
				></meta>
			</Head>
			<Container>
				<Section>
					<div
						className={
							styles.section +
							' flex items-center justify-center gap-5'
						}
					>
						{/* Profile Picture */}
						{Object.keys(spotify).length > 0 &&
						spotify.profile_pic_url &&
						!imageLoadError ? (
							<picture>
								<img
									onError={() => setImageLoadError(true)}
									className="rounded-full w-28 h-28"
									src={spotify.profile_pic_url}
									alt={spotify.display_name}
								/>
							</picture>
						) : (
							<DefaultProfilePicture />
						)}

						<div>
							{/* Name */}
							<h2 className={styles.name + ' break-all'}>
								{decodeURI(user.name)}
							</h2>

							{/* Username */}
							<p className="text-sm text-text/70">
								@{user.username}
							</p>

							{/* Spotify link */}
							{user.spotify_users && (
								<>
									<motion.a
										href={`https://open.spotify.com/user/${user.spotify_users.spotify_userid}`}
										whileHover={{
											scale: 1.1,
										}}
										whileTap={{
											scale: 0.9,
										}}
										className="cursor-pointer flex items-center w-min gap-1 bg-spotify p-2 px-4 rounded-lg my-2"
									>
										<FaSpotify />
										Spotify
									</motion.a>
								</>
							)}
						</div>
					</div>

					<div
						className={
							styles.section +
							' flex flex-col items-center text-center'
						}
					>
						{currentSongStatus === 'success' && (
							<>
								<p className="text-text/70 mb-5 text-sm">
									I&apos;m currently listening to
								</p>
								{Object.keys(currentSongData).length > 0 ? (
									<>
										<MusicPlayer
											name={currentSongData.name}
											artists={currentSongData.artists
												.map((a: any) => a.name)
												.join(', ')}
											imageUrl={currentSongData.album_art}
											spotifyLink={`https://open.spotify.com/track/${currentSongData.id}`}
										/>
									</>
								) : (
									<MusicPlayerNotPlaying />
								)}
							</>
						)}

						{currentSongStatus === 'error' && (
							<>
								<p className="text-text/70 mb-5 text-sm">
									I&apos;m currently listening to
								</p>
								<MusicPlayerError />
							</>
						)}
					</div>

					<div className={styles.section}>
						{/* {topSongsStatus === 'success' &&
					topSongsData &&
					topSongsData.length > 0 && ( */}
						<>
							<h2 className={styles.name + ' mb-5'}>
								Top Songs of the month
							</h2>
							<div className="grid grid-cols-2 md:grid-cols-5 gap-5">
								{top.map((currentSong: any) => (
									<SongCard
										key={currentSong.id}
										name={currentSong.name}
										artists={currentSong.artists
											.map((a: any) => a.name)
											.join(', ')}
										imageUrl={currentSong.album_art}
										spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}
									/>
								))}
							</div>
						</>
						{/* )} */}
					</div>
				</Section>
			</Container>

			<ShareButton url={window.location.href} />
		</>
	);
};

export default UserPage;
