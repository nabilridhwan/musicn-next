import axiosInstance from '../axiosInstance';

export type SignupProps = {
	username: string;
	email: string;
	name: string;
	password: string;
	confirm_password: string;
}
export default async function signup({username, email, name, password, confirm_password}: SignupProps) {
	const result = await axiosInstance.post(`/api/signup`, {
		username,
		email,
		name,
		password,
		confirm_password,
	});

	return result.data.data;
}
