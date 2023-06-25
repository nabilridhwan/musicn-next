import axiosInstance from '@/frontend-api/axiosInstance';

export default async function getTopSongsStatus(username: string) {
  const result = await axiosInstance.get(`api/song/top/${username}/status`);

  return result.status;
}
