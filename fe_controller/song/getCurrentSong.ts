import axiosInstance from '../../util/axiosInstance';

export default async function getCurrentSong(username: string) {
	const result = await axiosInstance.get(`api/song/current/${username}`);

	return result.data.data;
}
