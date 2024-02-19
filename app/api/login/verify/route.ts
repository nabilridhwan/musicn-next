import {cookies} from 'next/headers';
import {lucia} from '@/util/auth';

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
