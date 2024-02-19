import {generateState} from 'arctic';
import {cookies} from 'next/headers';
import {spotify} from '@/util/auth';
import {NextRequest, NextResponse} from 'next/server';

export const dynamic = 'force-dynamic'; // defaults to auto

const generateLoginRoute = async () => {
  const cookieStore = cookies();

  const state = generateState();
  const url: URL = await spotify.createAuthorizationURL(state, {
    scopes: [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-read-currently-playing',
    ],
  });

  // Set the state, to be verified in callback route
  cookieStore.set('spotify_auth_state', state, {
    secure: false, // set to false in localhost
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10, // 10 min
  });

  return url.toString();
};

export async function GET(request: NextRequest): Promise<Response> {
  const route = await generateLoginRoute();
  return NextResponse.redirect(route);
}
