import {cookies} from 'next/headers';
import {lucia} from '@/util/auth';
import {redirect} from 'next/navigation';
import {NextRequest} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: NextRequest): Promise<Response> {
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
