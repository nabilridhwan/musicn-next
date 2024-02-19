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

/**
 * This CALLBACK route handles both login and signup processes (it is redirected after doing Spotify's OAuth2 flow)
 * If the user signs in with spotify and has a Musicn account, they will be logged in and set a session to their Musicn account.
 * Otherwise, if it is their first time, an account will be automatically made using their Spotify credentials first. (To avoid conflict, the Musicn's username will be the same as their Spotify user id)
 * And then, preferences will be true for everything except for account. This is so that we can bring the user to the onboarding to set their display name, username, preferences and, etc.
 * @param request
 * @constructor
 */
export async function GET(request: Request): Promise<Response> {
  const cookieStore = cookies();
  //     Get searchParams from request
  const searchParams = new URL(request.url).searchParams;

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Verify the state (from the URL) and one that is stored in the cookie before starting the OAuth2 flow
  const storedState = cookieStore.get('spotify_auth_state')?.value;

  if (!code || !storedState || state !== storedState) {
    // 400
    throw new Error('Invalid request');
  }

  try {
    // Validate the authorization code and get the tokens
    const tokens = await spotify.validateAuthorizationCode(code);

    // Get own user profile
    const {
      email,
      display_name,
      country,
      images,
      id: spotify_userid,
    } = await SpotifyAPI.getOwnUserProfile(tokens.accessToken);

    // Tries to check if the user already exists in the database via the spotify user id
    let appUserFromPrisma = await prisma!.app_users.findFirst({
      where: {
        spotify_users: {
          spotify_userid: spotify_userid,
        },
      },
    });

    // if they don't exist (i.e, they're new), create a new user for them in the database
    if (!appUserFromPrisma) {
      appUserFromPrisma = await prisma!.app_users.create({
        data: {
          name: display_name,
          username: spotify_userid,
          num_of_visitors: 0,
          preferences: {
            create: {
              top: true,
              account: true,
              current: true,
              recent: true,
            },
          },
          spotify_users: {
            create: {
              spotify_userid,
              country,
              name: display_name,
              email,
              refresh_token: tokens.refreshToken,
              profile_pic_url: images[0].url || null,
            },
          },
        },
      });
    }

    // Create a new 'user' for the session (refer to schema as this is NOT app user)
    const prismaUser = await prisma?.user.create({
      data: {
        id: generateId(15),
      },
    });

    if (!prismaUser) {
      throw new Error('Failed to create user');
    }

    if (!appUserFromPrisma) {
      throw new Error('Failed to find/create app user');
    }

    // Creates a session and tie it to the session user
    const session = await lucia.createSession(prismaUser.id, {
      username: appUserFromPrisma.username,
      user_id: parseInt(appUserFromPrisma.user_id.toString()),
      spotify_user_id: spotify_userid,
    });

    // Creates a cookie for the session
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set the cookie
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
