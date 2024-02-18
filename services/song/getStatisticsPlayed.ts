import axiosInstance from '@/services/axiosInstance';

export default async function getStatisticsPlayed(username: string) {
  const result = await axiosInstance.get(
    `api/song/statistics/${username}/played`,
  );

  return result.data.data;
}
