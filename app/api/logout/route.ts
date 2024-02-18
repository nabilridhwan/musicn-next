import {generateState, OAuth2RequestError, Spotify} from 'arctic';
import SpotifyAPI from '@/class/Spotify';
import {cookies} from 'next/headers';
import {lucia} from '@/auth';
import {generateRandomString} from 'oslo/dist/crypto';
import {generateId} from 'lucia';
import {redirect} from 'next/navigation';

const REDIRECT_URL = 'http://localhost:3000/api/login/callback';

const spotify = new Spotify(
  'e849dc093c46431e99a380047315750d',
  '01c270e3ca77492a99fa2222c6b7ec2b',
  REDIRECT_URL,
);

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: Request): Promise<Response> {
  const cookieStore = cookies();

  // https://lucia-auth.com/basics/sessions
  const sessionCookie = lucia.createBlankSessionCookie();

  const sessionId = cookieStore.get('auth_session')?.value || '';

  await lucia.invalidateSession(sessionId);

  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect('/');
}
