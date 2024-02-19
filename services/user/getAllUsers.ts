import axiosInstance from '@/services/axiosInstance';

export default async function getAllUsers({query = ''}: {query?: string}) {
  let baseUrl = `/api/user`;

  if (query) {
    baseUrl = `${baseUrl}?q=${query}`;
  }

  const result = await axiosInstance.get(baseUrl);

  return result.data.data;
}
