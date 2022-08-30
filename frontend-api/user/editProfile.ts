import axiosInstance from '../axiosInstance';

export type EditProfileProps = {
	username?: string;
	email?: string;
	name?: string;
	password?: string;
};
export default async function editProfile({
	username,
	email,
	name,
	password,
}: EditProfileProps) {
	const result = await axiosInstance.put(`/api/me`, {
		username,
		email,
		name,
		password,
	});

	return result.data.data;
}
