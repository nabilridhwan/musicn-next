import InternalServerError from '@/class/Responses/InternalServerError';
import Spotify from '@/class/Spotify';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import {linkSpotifyUser} from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import {AxiosError} from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    // TODO: Reject if not signed in (APITokenHandler)
    let {error, code} = req.query;

    // Reject if error
    // if(error){

    // }

    if (code) {
      code = typeof code === 'string' ? code : code[0];

      const {refresh_token, access_token} =
        await Spotify.getRefreshTokenFromCode(
          code,
          process.env.SPOTIFY_REDIRECT_URL!,
        );

      const {
        email,
        display_name,
        country,
        images,
        id: spotify_userid,
      } = await Spotify.getUserProfile('noob', access_token);

      const data = APITokenHandler.extractDataFromToken(
        APITokenHandler.getToken(req)!,
      );

      // Update spotify user
      await linkSpotifyUser({
        country,
        name: display_name,
        email,
        profile_pic_url: images[0].url || null,
        spotify_userid,
        refresh_token,
        user_id: data?.user_id,
      });

      return res.redirect('/profile');

      // Write for the user
      // return new SuccessResponse(
      // 	'Updated/Linked Spotify user successfully',
      // 	{ user_id, name: display_name }
      // ).handleResponse(req, res);
    }
  } catch (error: any) {
    console.log(error);
    if (error instanceof AxiosError) {
      return res.redirect('/api/link/spotify');
    }
    return new InternalServerError(error.message).handleResponse(req, res);
  }
}

export default withSetupScript(withProtect(handler as IHandler) as IHandler);
