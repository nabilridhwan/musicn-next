import axiosInstance from '@/services/axiosInstance';

export default async function getRecentSongsStatus(username: string) {
  const result = await axiosInstance.get(`api/song/recent/${username}/status`);

  return result.status;
}
