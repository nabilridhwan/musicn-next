import axiosInstance from '@/frontend-api/axiosInstance';

export default async function updatePreferences({
	account,
	top,
	current,
	recent,
}: Preferences) {
	const result = await axiosInstance.put(`/api/me/preference`, {
		account,
		top,
		current,
		recent,
	});

	return result.data.data;
}
