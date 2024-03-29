import {getMe} from '@/api/getMe';
import {getSessionInformation} from '@/api/getSessionInformation';
import {NextApiResponse} from 'next';
import {NextRequest} from 'next/server';

export const dynamic = 'auto'; // defaults to auto

export async function GET(request: NextRequest, response: NextApiResponse) {
  return response.json(await getMe());
}

export async function PUT(request: NextRequest, response: NextApiResponse) {
  //   TODO: Validate body to have username and name
  const body = await request.json();

  const {username, name} = body;

  const sessionInfo = await getSessionInformation();

  if (!sessionInfo) {
    throw response.status(401).json('Session not found');
  }

  console.log(username, name);

  //   Write to database
  await prisma?.app_users.update({
    where: {
      user_id: sessionInfo.user_id,
    },
    data: {
      username,
      name,
    },
  });

  return response.json({
    message: 'Success',
    username: 'new username',
    name: 'new name',
  });
}
