import axiosInstance from '@/frontend-api/axiosInstance';

export type LoginProps = {
  username: string;
  password: string;
};
export default async function login({username, password}: LoginProps) {
  const result = await axiosInstance.post(`/api/login`, {
    username,
    password,
  });

  return result.data.data;
}
