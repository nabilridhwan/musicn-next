import axiosInstance from '@/frontend-api/axiosInstance';

export default async function getRecentSongs(username: string) {
	const result = await axiosInstance.get(`api/song/recent/${username}`);

	return result.data.data;
}
