import APITokenHandler from '@/util/APITokenHandler';
import {getUserById, getUserByUsername} from '@/model/users';
import NotFoundResponse from '@/class/Responses/NotFoundResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';

export async function getMe() {
  // const token = APITokenHandler.getToken(req);
  // const dataFromToken: any = APITokenHandler.extractDataFromToken(token!);
  const user = await getUserByUsername('nabil');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
