import {cookies} from 'next/headers';

export default function useUserSignedIn() {
  const cookieStore = cookies();
  return cookieStore.get('signed_in');
}
