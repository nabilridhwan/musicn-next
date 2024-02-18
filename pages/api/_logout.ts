import InternalServerError from '@/class/Responses/InternalServerError';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import APITokenHandler from '@/util/APITokenHandler';
import RedirectHandler from '@/util/RedirectHandler';
import type {NextApiRequest, NextApiResponse} from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    APITokenHandler.removeToken(req, res);
    if (RedirectHandler.hasRedirect(req)) {
      return RedirectHandler.handleRedirect(req, res);
    } else {
      res.redirect('/');
    }
  } catch (error: any) {
    return new InternalServerError(error.message).handleResponse(req, res);
  }
}

export default withSetupScript(withProtect(handler as IHandler) as IHandler);
