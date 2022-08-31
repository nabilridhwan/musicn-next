import axiosInstance from '@/frontend-api/axiosInstance';

export default async function getUserDetails(username: string) {
	const result = await axiosInstance.get(`api/user/${username}`);

	return result.data.data;
}
