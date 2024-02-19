import {cookies} from 'next/headers';
import {lucia} from '@/util/auth';
import {NextApiResponse} from 'next';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest, response: NextApiResponse) {
  try {
    const cookieStore = cookies();

    const sessionId = cookieStore.get('auth_session')?.value;

    console.log(sessionId);

    if (!sessionId) {
      return response.json({
        message: 'Invalid request. Session not available in cookie!',
      });
    }

    const {session} = await lucia.validateSession(sessionId);

    if (!session) {
      return response.json({
        message: 'Invalid session',
        sessionId,
      });
    }

    const sessions = await lucia.getUserSessions(session.userId);

    return response.json({
      session,
      sessions,
    });
  } catch (e: any) {
    console.error(e);
    return response.json({error: e.message});
  }
}
