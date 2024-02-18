import {cookies} from 'next/headers';

export default function useUserSignedIn() {
  const cookieStore = cookies();
  return cookieStore.get('auth_session')?.value !== undefined;
}
