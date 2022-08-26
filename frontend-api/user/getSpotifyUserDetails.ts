import axiosInstance from '../axiosInstance';

export type SpotifyUserDetails = {
	display_name: string;
	url: string;
	profile_pic_url: string | null;
	followers: number;
};

export default async function getSpotifyUserDetails(
	username: string
): Promise<SpotifyUserDetails | {}> {
	const result = await axiosInstance.get(`/api/user/spotify/${username}`);

	return result.data.data;
}
