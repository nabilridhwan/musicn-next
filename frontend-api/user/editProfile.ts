import axiosInstance from '@/frontend-api/axiosInstance';

export default async function editProfile({
  username,
  email,
  name,
  password,
}: EditProfileProps) {
  const result = await axiosInstance.put(`/api/me`, {
    username,
    email,
    name,
    password,
  });

  return result.data.data;
}
