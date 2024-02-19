import {generateState, OAuth2RequestError, Spotify} from 'arctic';
import SpotifyAPI from '@/class/Spotify';
import {cookies} from 'next/headers';
import {lucia} from '@/util/auth';
import {generateRandomString} from 'oslo/dist/crypto';
import {generateId} from 'lucia';
import {redirect} from 'next/navigation';

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
