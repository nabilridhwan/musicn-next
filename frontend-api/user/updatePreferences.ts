import axiosInstance from '@/frontend-api/axiosInstance';

export default async function updatePreferences({
	top,
	current,
	recent,
}: Preferences) {
	const result = await axiosInstance.put(`/api/me/preference`, {
		top,
		current,
		recent,
	});

	return result.data.data;
}
