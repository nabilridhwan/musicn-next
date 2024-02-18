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

  // TODO: Force user to sign out
  if (!prismaSession) {
    return null;
  }

  const user = await getUserByUsername(prismaSession.username);

  // TODO: Force user to sign out
  if (!user) {
    return null;
  }

  return user;
}
