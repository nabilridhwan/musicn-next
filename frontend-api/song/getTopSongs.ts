import axiosInstance from '@/frontend-api/axiosInstance';

export default async function getTopSongs(username: string) {
	const result = await axiosInstance.get(`api/song/top/${username}`);

	return result.data.data;
}
