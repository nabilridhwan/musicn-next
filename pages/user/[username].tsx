import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Container from '../../components/Container';
import MusicPlayer from '../../components/MusicPlayer';
import Section from '../../components/Section';
import getCurrentSong from '../../fe_controller/song/getCurrentSong';
import getRecentSongs from '../../fe_controller/song/getRecentSongs';
import getTopSongs from '../../fe_controller/song/getTopSongs';
import PromisifyAxiosResponse from '../../util/PromisifyAxiosResponse';

type UsersProps = {
	user: any;
};

export async function getServerSideProps(context: any) {
	const { username } = context.query;

	const r = await PromisifyAxiosResponse(
		{
			user: axios.get(`http://localhost:3000/api/user/${username}`),
		},
		'data'
	);

	return {
		props: {
			...r,
		},
	};
}

const UserPage = ({ user }: UsersProps) => {
	console.log(user);

	const {
		data: recentSongs,
		isLoading: isRecentSongsLoading,
		isError: isRecentSongsError,
		isSuccess: isRecentSongsSuccess,
		status: recentSongsStatus,
	} = useQuery(
		['recentSongs', user.username],
		async () => await getRecentSongs(user.username)
	);

	const {
		data: currentSong,
		isLoading: isCurrentSongLoading,
		isError: isCurrentSongError,
		isSuccess: isCurrentSongSuccess,
		status: currentSongStatus,
	} = useQuery(
		['currentSongs', user.username],
		async () => await getCurrentSong(user.username)
	);

	const {
		data: topSongs,
		isLoading: isTopSongsLoading,
		isError: isTopSongsError,
		isSuccess: isTopSongsSuccess,
		status: topSongsStatus,
	} = useQuery(
		['topSongs', user.username],
		async () => await getTopSongs(user.username)
	);

	return (
		<Container>
			<Section>
				<h2>{user.name}</h2>

				<p>{user.username}</p>
				{user.spotify_users && (
					<div>
						{user.spotify_users.profile_pic_url}
						{user.spotify_users.spotify_userid}
					</div>
				)}

				{currentSongStatus === 'success' &&
					Object.keys(currentSong).length > 0 && (
						<MusicPlayer
							name={currentSong.item.name}
							artists={currentSong.item.artists
								.map((a: any) => a.name)
								.join(', ')}
							imageUrl={currentSong.item.album.images[2].url}
							spotifyLink={
								currentSong.item.external_urls?.spotify
							}
						/>
					)}
			</Section>
		</Container>
	);
};

export default UserPage;
