import axiosInstance from './axiosInstance';

export default async function getAllUsers() {
	const result = await axiosInstance.get(`/api/user`);

	return result.data.data;
}
