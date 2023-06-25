import axiosInstance from '@/frontend-api/axiosInstance';

export default async function signup({
  username,
  email,
  name,
  password,
  confirm_password,
}: SignupProps) {
  const result = await axiosInstance.post(`/api/signup`, {
    username,
    email,
    name,
    password,
    confirm_password,
  });

  return result.data.data;
}
