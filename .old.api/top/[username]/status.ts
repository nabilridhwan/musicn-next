import BaseErrorResponse from '@/class/Responses/BaseErrorResponse';
import InternalServerError from '@/class/Responses/InternalServerError';
import NotFoundResponse from '@/class/Responses/NotFoundResponse';
import SpotifyInvalidPermissionResponse from '@/class/Responses/SpotifyInvalidPermissionResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import Spotify from '@/class/Spotify';
import withSetupScript from '@/middleware/withSetupScript';
import {getUserByUsername} from '@/model/users';
import Cache from '@/util/Cache';
import {AxiosError} from 'axios';
import type {NextApiRequest, NextApiResponse} from 'next';
import * as yup from 'yup';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // Cache results in edge server for 2 days
  Cache.inEdgeServer(res, 60 * 60 * 24 * 2);

  try {
    const schema = yup.object().shape({
      username: yup.string().required('Username required'),
    });

    const validatedData = await schema.validate(
      {
        username: req.query.username,
      },
      {abortEarly: false},
    );

    const data = (await getUserByUsername(validatedData.username)) as any;

    if (data.length === 0) {
      return new NotFoundResponse().handleResponse(req, res);
    }

    const user = data[0];

    // Check if spotify_users is falsy
    if (!user.spotify_users) {
      return new BaseErrorResponse(
        400,
        'Spotify account not linked',
        {},
      ).handleResponse(req, res);
    }

    const refresh_token = user.spotify_users.refresh_token;
    const accessToken = await Spotify.getAccessTokenFromRefreshToken(
      refresh_token,
    );

    // Attempt to get the top songs
    await Spotify.getTopSongs(accessToken, 1, 'short_term');

    return new SuccessResponse('Top songs status OK!').handleResponse(req, res);
  } catch (error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return new SpotifyInvalidPermissionResponse().handleResponse(req, res);
      }
    }

    return new InternalServerError(error.message).handleResponse(req, res);
  }
}

export default withSetupScript(handler as IHandler);
