import axios from 'axios';

export default async function getCurrentSong(username: string) {
	const result = await axios.get(
		`http://localhost:3000/api/song/current/${username}`
	);

	return result.data.data;
}
