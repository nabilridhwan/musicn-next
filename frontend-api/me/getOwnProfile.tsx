import axiosInstance from '@/frontend-api/axiosInstance';
import {AxiosResponse} from 'axios';

export interface ApiResponse<T> {
  status: number;
  error: boolean;
  message: string;
  data: T;
}

export interface Data {
  user_id: number;
  username: string;
  password: string;
  created_at: string;
  email: string;
  name: string;
  spotify_linked: boolean;
  activated: boolean;
  spotify_users?: SpotifyUsers;
  preferences?: Preferences;
}

export interface SpotifyUsers {
  id: number;
  email: string;
  name: string;
  spotify_userid: string;
  country: string;
  profile_pic_url: string;
  created_at: string;
  refresh_token: string;
  user_id: number;
  updated_at: string;
}

export interface Preferences {
  id: number;
  user_id: number;
  top: boolean;
  current: boolean;
  recent: boolean;
  created_at: string;
  updated_at: string;
  account: boolean;
}

export default async function getOwnProfile() {
  const result: AxiosResponse<ApiResponse<Data>> = await axiosInstance.get(
    `api/me`,
  );

  return result.data.data;
}
