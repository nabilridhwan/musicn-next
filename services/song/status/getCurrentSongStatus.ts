import axiosInstance from '@/services/axiosInstance';

export default async function getCurrentSongStatus(username: string) {
  console.log(username);
  const result = await axiosInstance.get(`api/song/current/${username}/status`);

  return result.status;
}
