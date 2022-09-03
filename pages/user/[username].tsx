import LoadingSpinner from '@/components/LoadingSpinner';
import {
	MusicPlayer,
	MusicPlayerError,
	MusicPlayerNotPlaying,
	MusicPlayerPrivate,
} from '@/components/MusicPlayer';
import MusicPreviewDialog from '@/components/MusicPreviewDialog';
import RecentlyPlayedSongCard from '@/components/RecentlyPlayedSongCard';
import Section from '@/components/Section';
import ShareButton from '@/components/ShareButton';
import SongCard from '@/components/SongCard';
import { MusicPreviewDialogContext } from '@/context/MusicPreviewDialogProvider';
import getCurrentSong from '@/frontend-api/song/getCurrentSong';
import getRecentSongs from '@/frontend-api/song/getRecentSongs';
import getTopSongs from '@/frontend-api/song/getTopSongs';
import getUserDetails from '@/frontend-api/user/getUserDetails';
import styles from '@/styles/UserPage.module.css';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { FaSpotify } from 'react-icons/fa';
import Container from '../../components/Container';
import DefaultProfilePicture from '../../components/DefaultProfilePicture';

type UsersProps = {
	user: any;
	top: any;
};

export async function getServerSideProps(context: any) {
	const { username } = context.query;

	try {
		let [user, top] = await axios.all([
			getUserDetails(username),
			getTopSongs(username),
		]);

		if (!user.spotify_users) {
			throw new Error('No spotify user found');
		}

		console.log(user);

		if (user.preferences.account === false) {
			throw new Error('Account is not visible to the public');
		}

		if (user.preferences.top === false) {
			top = [];
		}

		return {
			props: {
				user: user,
				top,
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

enum SECTION {
	TOP_SONGS = 'top_songs',
	RECENTLY_PLAYED_SONGS = 'recently_played_songs',
}

const sections = [
	{
		title: 'Top Songs',
		enum: SECTION.TOP_SONGS,
	},
	{
		title: 'Recently Played Songs',
		enum: SECTION.RECENTLY_PLAYED_SONGS,
	},
];

const UserPage = ({ user, top }: UsersProps) => {
	const {
		showDialog,
		showSongPreview,
		hideSongPreview,
		songDetails,
		setVolume,
		volume,
	} = useContext(MusicPreviewDialogContext);

	const [currentSection, setCurrentSection] = useState<SECTION>(
		SECTION.TOP_SONGS
	);

	const [currentTitle, setCurrentTitle] = useState<string>(sections[0].title);

	const [imageLoadError, setImageLoadError] = useState(false);

	const {
		data: recentSongsData,
		isLoading: isRecentSongsLoading,
		isError: isRecentSongsError,
		isSuccess: isRecentSongsSuccess,
		status: recentSongsStatus,
		refetch: refetchRecentSongs,
	} = useQuery(
		['recentSongs', user.username],
		async () => await getRecentSongs(user.username),
		{ retry: 2 }
	);

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

	useEffect(() => {
		if (currentSection === SECTION.TOP_SONGS) {
			setCurrentTitle(sections[0].title);
		} else {
			refetchRecentSongs();
			setCurrentTitle(sections[1].title);
		}
	}, [currentSection]);

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
						{user.spotify_users &&
						user.spotify_users.profile_pic_url &&
						!imageLoadError ? (
							<picture>
								<img
									onError={() => setImageLoadError(true)}
									className="rounded-full w-28 h-28"
									src={user.spotify_users.profile_pic_url}
									alt={user.name}
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
										href={`https://open.spotify.com/user/${user.spotify_users.spotify_userid}?go=1`}
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
											preview={currentSongData.preview}
										/>
									</>
								) : (
									<MusicPlayerNotPlaying />
								)}
							</>
						)}

						{currentSongStatus === 'error' && (
							<>
								{typeof currentSongData === 'undefined' ? (
									<>
										<p className="text-text/70 mb-5 text-sm">
											I&apos;m currently listening to
										</p>
										<MusicPlayerPrivate />
									</>
								) : (
									<>
										<p className="text-text/70 mb-5 text-sm">
											I&apos;m currently listening to
										</p>
										<MusicPlayerError />
									</>
								)}
							</>
						)}
					</div>

					{/* Top songs / Recently Played Songs */}
					<div className={styles.section}>
						<div className="flex gap-3">
							{sections.map((section, i) => (
								<motion.h2
									key={i}
									onClick={() => {
										setCurrentSection(section.enum);
									}}
									className={`text-xl font-bold mb-5 cursor-pointer ${
										currentSection === section.enum
											? 'text-text'
											: 'muted'
									}`}
								>
									{section.title}

									{currentSection === section.enum && (
										<motion.div
											className="w-100 h-1 rounded-full mt-1"
											layoutId="underline"
											style={{ backgroundColor: 'white' }}
										/>
									)}
								</motion.h2>
							))}
						</div>

						{currentSection === SECTION.TOP_SONGS && (
							<>
								<div className="grid grid-cols-2 md:grid-cols-5 gap-5">
									{top.map((currentSong: any) => (
										<SongCard
											key={currentSong.id}
											name={currentSong.name}
											artists={currentSong.artists
												.map((a: any) => a.name)
												.join(', ')}
											imageUrl={currentSong.album_art}
											preview={currentSong.preview}
											spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}
										/>
									))}
								</div>

								{top.length === 0 && (
									<Nothing
										text={
											'No top songs or the user has made it private :('
										}
									/>
								)}
							</>
						)}

						{currentSection === SECTION.RECENTLY_PLAYED_SONGS && (
							<>
								<div className="grid gap-5">
									{recentSongsStatus === 'success' &&
										recentSongsData.map(
											(currentSong: any) => (
												<RecentlyPlayedSongCard
													key={currentSong.id}
													name={currentSong.name}
													artists={currentSong.artists
														.map((a: any) => a.name)
														.join(', ')}
													imageUrl={
														currentSong.album_art
													}
													preview={
														currentSong.preview
													}
													played_at={
														currentSong.played_at
													}
													spotifyLink={`https://open.spotify.com/track/${currentSong.id}`}
												/>
											)
										)}
								</div>

								{isRecentSongsError &&
									(typeof recentSongsData === 'undefined' ||
										recentSongsData.length === 0) && (
										<Nothing
											text={
												'No recently played songs or the user has made it private :('
											}
										/>
									)}

								{isRecentSongsLoading && <LoadingSpinner />}
							</>
						)}
					</div>

					{/* TODO: Show actual volume */}
					<MusicPreviewDialog handleClose={hideSongPreview} />
				</Section>
			</Container>
			<ShareButton overrideText="Share" />
		</>
	);
};

function Nothing({ text }: { text: string }) {
	return (
		<div className="text-text/50 text-center my-20">
			<p>{text}</p>
		</div>
	);
}

export default UserPage;
