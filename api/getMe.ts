import APITokenHandler from '@/util/APITokenHandler';
import {getUserById, getUserByUsername} from '@/model/users';
import NotFoundResponse from '@/class/Responses/NotFoundResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import {cookies} from 'next/headers';
import {lucia} from '@/auth';
import {getSessionInformation} from '@/api/getSessionInformation';

export async function getMe() {
  // const token = APITokenHandler.getToken(req);
  // const dataFromToken: any = APITokenHandler.extractDataFromToken(token!);

  const prismaSession = await getSessionInformation();

  if (!prismaSession) {
    return null;
  }

  const user = await getUserByUsername(prismaSession.username);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
