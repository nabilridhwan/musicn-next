import {cookies} from 'next/headers';
import {lucia} from '@/util/auth';
import {NextRequest, NextResponse} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();

    const sessionId = cookieStore.get('auth_session')?.value;

    console.log(sessionId);

    if (!sessionId) {
      return NextResponse.json({
        message: 'Invalid request. Session not available in cookie!',
      });
    }

    const {session} = await lucia.validateSession(sessionId);

    if (!session) {
      return NextResponse.json({
        message: 'Invalid session',
        sessionId,
      });
    }

    const sessions = await lucia.getUserSessions(session.userId);

    return NextResponse.json({
      session,
      sessions,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({error: e.message});
  }
}
