import axios from 'axios';

export default async function getTopSongs(username: string) {
	const result = await axios.get(
		`http://localhost:3000/api/song/top/${username}`
	);

	return result.data.data;
}
