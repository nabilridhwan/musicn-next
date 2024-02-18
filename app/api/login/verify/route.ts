import {generateState, OAuth2RequestError, Spotify} from 'arctic';
import SpotifyAPI from '@/class/Spotify';
import {cookies} from 'next/headers';
import {lucia} from '@/auth';
import {generateRandomString} from 'oslo/dist/crypto';
import {generateId} from 'lucia';

const REDIRECT_URL = 'http://localhost:3000/api/login/callback';

const spotify = new Spotify(
  'e849dc093c46431e99a380047315750d',
  '01c270e3ca77492a99fa2222c6b7ec2b',
  REDIRECT_URL,
);

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: Request): Promise<Response> {
  try {
    const cookieStore = cookies();

    const sessionId = cookieStore.get('auth_session')?.value;

    console.log(sessionId);

    if (!sessionId) {
      return Response.json({
        message: 'Invalid request. Session not available in cookie!',
      });
    }

    const {session} = await lucia.validateSession(sessionId);

    if (!session) {
      return Response.json({
        message: 'Invalid session',
        sessionId,
      });
    }

    const sessions = await lucia.getUserSessions(session.userId);

    return Response.json({
      session,
      sessions,
    });
  } catch (e) {
    console.error(e);
    return Response.error(e.message);
  }
}
