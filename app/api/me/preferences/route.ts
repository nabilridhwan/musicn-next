import {generateState, OAuth2RequestError, Spotify} from 'arctic';
import SpotifyAPI from '@/class/Spotify';
import {cookies} from 'next/headers';
import {lucia} from '@/util/auth';
import {generateRandomString} from 'oslo/dist/crypto';
import {generateId} from 'lucia';
import {redirect} from 'next/navigation';
import {getMe} from '@/api/getMe';
import {getSessionInformation} from '@/api/getSessionInformation';

export const dynamic = 'auto'; // defaults to auto

export async function GET(request: Request): Promise<Response> {
  return Response.json(await getMe());
}

export async function PUT(request: Request) {
  //   TODO: Validate body to have username and name
  const body = await request.json();

  const {account, top, current, recent} = body;

  const sessionInfo = await getSessionInformation();

  if (!sessionInfo) {
    throw Response.json('Session not found', {status: 401});
  }

  //   Write to database
  await prisma?.preferences.update({
    where: {
      user_id: sessionInfo.user_id,
    },
    data: {
      account,
      top,
      current,
      recent,
    },
  });

  return Response.json({
    message: 'Success',
    username: 'new username',
    name: 'new name',
  });
}
