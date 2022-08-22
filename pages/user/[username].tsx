import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
import Container from '../../components/Container';
import MusicPlayer from '../../components/MusicPlayer';
import Section from '../../components/Section';
import SongCard from '../../components/SongCard';
import getCurrentSong from '../../fe_controller/song/getCurrentSong';
import axiosInstance from '../../util/axiosInstance';

type UsersProps = {
	user: any;
	top: any;
};

export async function getServerSideProps(context: any) {
	const { username } = context.query;

	try {
		const user = await axiosInstance.get(`/api/user/${username}`);
		const top = await axiosInstance.get(`/api/song/top/${username}`);

		const userRtn = user.data.data;
		const topRtn = top.data.data;

		if (!userRtn.spotify_users) {
			throw new Error('No spotify user found');
		}

		return {
			props: {
				user: userRtn,
				top: topRtn,
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

const UserPage = ({ user, top }: UsersProps) => {
	console.log(user);
	console.log(top);

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
		async () => await getCurrentSong(user.username)
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
				<title>{decodeURI(user.name)}&apos;s Profile</title>

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
					{/* Profile Picture */}
					{user.spotify_users &&
						user.spotify_users.profile_pic_url && (
							<img
								className="rounded-full w-40"
								src={user.spotify_users.profile_pic_url}
								alt={user.spotify_users.name}
							/>
						)}

					{/* Name */}
					<h2>{decodeURI(user.name)}</h2>

					{/* Username */}
					<p>@{user.username}</p>

					{/* Spotify link */}
					{user.spotify_users && (
						<>
							<Link
								href={`https://open.spotify.com/user/${user.spotify_users.spotify_userid}`}
							>
								<a>Spotify</a>
							</Link>
						</>
					)}

					{currentSongStatus === 'success' &&
						Object.keys(currentSongData).length > 0 && (
							<>
								<p>Currently Listening to</p>
								<MusicPlayer
									name={currentSongData.item.name}
									artists={currentSongData.item.artists
										.map((a: any) => a.name)
										.join(', ')}
									imageUrl={
										currentSongData.item.album.images[2].url
									}
									spotifyLink={
										currentSongData.item.external_urls
											?.spotify
									}
								/>
							</>
						)}

					{/* {topSongsStatus === 'success' &&
					topSongsData &&
					topSongsData.length > 0 && ( */}
					<>
						<h2>Top Songs</h2>
						<div className="grid grid-cols-2 md:grid-cols-5 gap-5">
							{top.map((currentSong: any) => (
								<SongCard
									key={currentSong.id}
									name={currentSong.name}
									artists={currentSong.artists
										.map((a: any) => a.name)
										.join(', ')}
									imageUrl={currentSong.album_art}
									spotifyLink={
										currentSong.external_urls?.spotify
									}
								/>
							))}
						</div>
					</>
					{/* )} */}
				</Section>
			</Container>
		</>
	);
};

export default UserPage;
