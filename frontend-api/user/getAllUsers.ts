import axiosInstance from '@/frontend-api/axiosInstance';

export default async function getAllUsers() {
  const result = await axiosInstance.get(`/api/user`);

  return result.data.data;
}
