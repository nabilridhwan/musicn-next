import {generateState, Spotify} from 'arctic';
import {cookies} from 'next/headers';

export const dynamic = 'force-dynamic'; // defaults to auto

const spotify = new Spotify(
  'e849dc093c46431e99a380047315750d',
  '01c270e3ca77492a99fa2222c6b7ec2b',
  'http://localhost:3000/api/login/callback',
);

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

export async function GET(request: Request): Promise<Response> {
  const route = await generateLoginRoute();
  return Response.redirect(route);
}
