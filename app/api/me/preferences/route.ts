import {getMe} from '@/api/getMe';
import {getSessionInformation} from '@/api/getSessionInformation';
import {NextRequest, NextResponse} from 'next/server';

export const dynamic = 'auto'; // defaults to auto

export async function GET(request: NextRequest) {
  return NextResponse.json(await getMe());
}

export async function PUT(request: NextRequest) {
  //   TODO: Validate body to have username and name
  const body = await request.json();

  const {account, top, current, recent} = body;

  const sessionInfo = await getSessionInformation();

  if (!sessionInfo) {
    throw NextResponse.json({error: 'Session not found', status: 401});
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

  return NextResponse.json({
    message: 'Success',
    username: 'new username',
    name: 'new name',
  });
}
