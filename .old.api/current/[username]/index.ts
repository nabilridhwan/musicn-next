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
  Cache.inEdgeServer(res, 10);
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

    if (user.preferences && user.preferences.current === false) {
      return new BaseErrorResponse(
        204,
        'Current song is disabled in preferences',
        {},
      ).handleResponse(req, res);
    }

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

    let currentlyPlayingSong = await Spotify.getCurrentlyPlayingSong(
      accessToken,
    );

    if (Object.keys(currentlyPlayingSong).length > 0) {
      const cps_data = currentlyPlayingSong.item;
      currentlyPlayingSong = {
        id: cps_data.id,
        name: cps_data.name,
        artists: cps_data.artists.map((a: any) => ({
          name: a.name,
          id: a.id,
        })),
        album: cps_data.album.name,
        album_art: cps_data.album.images[0]?.url,
        popularity: cps_data.popularity,
        duration: cps_data.duration_ms,
        preview: cps_data.preview_url ?? null,
        uri: cps_data.uri,
      };
    }

    return new SuccessResponse('Success', currentlyPlayingSong).handleResponse(
      req,
      res,
    );
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
