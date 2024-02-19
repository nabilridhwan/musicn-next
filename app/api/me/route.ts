import {getMe} from '@/api/getMe';
import {getSessionInformation} from '@/api/getSessionInformation';

export const dynamic = 'auto'; // defaults to auto

export async function GET(request: Request): Promise<Response> {
  return Response.json(await getMe());
}

export async function PUT(request: Request) {
  //   TODO: Validate body to have username and name
  const body = await request.json();

  const {username, name} = body;

  const sessionInfo = await getSessionInformation();

  if (!sessionInfo) {
    throw Response.json('Session not found', {status: 401});
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

  return Response.json({
    message: 'Success',
    username: 'new username',
    name: 'new name',
  });
}
