import InternalServerError from '@/class/Responses/InternalServerError';
import Spotify from '@/class/Spotify';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import APITokenHandler from '@/util/APITokenHandler';
import type {NextApiRequest, NextApiResponse} from 'next';

const SCOPE =
  'user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    // TODO: Reject if not signed in
    APITokenHandler.reject('none', req, res);

    if (req.method === 'GET') {
      res.redirect(
        Spotify.getUserAuthorizationUrl(
          SCOPE,
          process.env.SPOTIFY_REDIRECT_URL!,
        ),
      );
    }
  } catch (error: any) {
    return new InternalServerError(error.message).handleResponse(req, res);
  }
}

export default withSetupScript(withProtect(handler) as IHandler);
