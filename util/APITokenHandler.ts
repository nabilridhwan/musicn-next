import BodyValidationErrorResponse from '@/class/Responses/BodyValidationErrorResponse';
import UnauthorizedResponse from '@/class/Responses/UnauthorizedResponse';
import {verifyJWT} from '@/util/jwt';
import {deleteCookie} from 'cookies-next';
import {NextApiRequest, NextApiResponse} from 'next';

namespace APITokenHandler {
  const tokenKey = 'token';

  export type REJECT_WHEN = 'none' | 'has' | 'invalid' | 'expired';

  export function getToken(req: NextApiRequest): string {
    return req.cookies[tokenKey]!;
  }

  export function hasAPIToken(req: NextApiRequest) {
    return !!req.cookies[tokenKey];
  }

  export function reject(
    rejectWhen: REJECT_WHEN,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    switch (rejectWhen) {
      case 'none':
        if (!hasAPIToken(req)) {
          return new UnauthorizedResponse(
            'You cannot access this resource without an API token.',
          ).handleResponse(req, res);
        }
        break;
      case 'has':
        if (hasAPIToken(req)) {
          return new BodyValidationErrorResponse(
            'You cannot access this resource because you are already signed in',
          ).handleResponse(req, res);
        }
        break;
    }
  }

  export function extractDataFromToken(token: string) {
    try {
      const data = verifyJWT(token);
      return data;
    } catch (error) {
      console.log('Error in extractDataFromToken', error);
      return null;
    }
  }

  export function removeToken(req: NextApiRequest, res: NextApiResponse) {
    deleteCookie(tokenKey, {
      req,
      res,
    });

    deleteCookie('signed_in', {
      req,
      res,
    });
  }
}

export default APITokenHandler;
