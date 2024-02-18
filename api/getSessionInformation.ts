import APITokenHandler from '@/util/APITokenHandler';
import {getUserById, getUserByUsername} from '@/model/users';
import NotFoundResponse from '@/class/Responses/NotFoundResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import {cookies} from 'next/headers';
import {lucia} from '@/auth';

/**
 * This function gets the session information via the sessionId (optional)
 * If sessionId is not provided, it will attempt to get the session from the cookie
 * @param sessionId
 * @returns Prisma Session Information
 */
export async function getSessionInformation(sessionId?: string) {
  // const token = APITokenHandler.getToken(req);
  // const dataFromToken: any = APITokenHandler.extractDataFromToken(token!);
  const cookieStore = cookies();

  if (!sessionId) {
    const s = cookieStore.get('auth_session')?.value;

    if (!s) {
      return null;
    }

    sessionId = s;
  }

  const {session} = await lucia.validateSession(sessionId);

  if (!session) {
    return null;
  }

  const prismaSession = await prisma?.session.findFirst({
    where: {
      id: session.id,
    },
  });

  if (!prismaSession) {
    throw new Error('Session not found in Prisma');
  }

  return prismaSession;
}
