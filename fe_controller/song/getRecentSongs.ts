import axios from 'axios';

export default async function getRecentSongs(username: string) {
	const result = await axios.get(
		`http://localhost:3000/api/song/recent/${username}`
	);

	return result.data.data;
}
