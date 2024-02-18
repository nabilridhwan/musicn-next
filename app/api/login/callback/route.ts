import {generateState, OAuth2RequestError, Spotify} from 'arctic';
import SpotifyAPI from '@/class/Spotify';
import {cookies} from 'next/headers';
import {lucia} from '@/auth';
import {generateRandomString} from 'oslo/dist/crypto';
import {generateId} from 'lucia';
import {permanentRedirect} from 'next/navigation';

const REDIRECT_URL = 'http://localhost:3000/api/login/callback';

const spotify = new Spotify(
  'e849dc093c46431e99a380047315750d',
  '01c270e3ca77492a99fa2222c6b7ec2b',
  REDIRECT_URL,
);

export const dynamic = 'force-dynamic'; // defaults to auto

export async function GET(request: Request): Promise<Response> {
  const cookieStore = cookies();
  //     Get searchParams from request
  const searchParams = new URL(request.url).searchParams;

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const storedState = cookieStore.get('spotify_auth_state')?.value;

  console.log(state, storedState);

  if (!code || !storedState || state !== storedState) {
    // 400
    throw new Error('Invalid request');
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);

    const {
      email,
      display_name,
      country,
      images,
      id: spotify_userid,
    } = await SpotifyAPI.getOwnUserProfile(tokens.accessToken);

    const user = await prisma?.app_users.findFirst({
      where: {
        spotify_users: {
          spotify_userid: spotify_userid,
        },
      },
    });

    if (!user) {
      throw new Error('User not found. Sign up not implemented yet!');
    }

    const prismaUser = await prisma?.user.create({
      data: {
        id: generateId(15),
      },
    });

    if (!prismaUser) {
      throw new Error('Failed to create user');
    }

    const session = await lucia.createSession(prismaUser.id, {
      username: user.username,
      user_id: parseInt(user.user_id.toString()),
      spotify_user_id: spotify_userid,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    // TODO: Change this to redirect to the app
    return Response.redirect('http://localhost:3000');
  } catch (e) {
    console.error(e);

    if (e instanceof OAuth2RequestError) {
      const {message, description, request} = e;

      return Response.json({
        message,
        description,
        request,
      });
    }

    return Response.json({
      message: 'Unknown error',
      error: e,
    });
    // unknown error
  }
}
