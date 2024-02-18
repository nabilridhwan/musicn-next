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
import {DateTime} from 'luxon';
import type {NextApiRequest, NextApiResponse} from 'next';
import * as yup from 'yup';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  Cache.inEdgeServer(res, 30);
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

    if (user.preferences && user.preferences.recent === false) {
      return new BaseErrorResponse(
        204,
        'Recent songs is disabled in preferences',
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

    let recentSongs = await Spotify.getRecentlyPlayedSongsByMonth(
      accessToken,
      DateTime.now().minus({months: 1}).toJSDate(),
    );

    // console.log(recentSongs);

    recentSongs = recentSongs.reduce((acc, song: any) => {
      if (acc[song.track.name]) {
        acc[song.track.name].amount = acc[song.track.name].amount + 1;
      } else {
        acc[song.track.name] = {
          id: song.track.id,
          name: song.track.name,
          artists: song.track.artists.map((a: any) => ({
            name: a.name,
            id: a.id,
          })),
          album: song.track.album.name,
          album_art: song.track.album.images[0]?.url,
          popularity: song.track.popularity,
          duration: song.track.duration_ms,
          preview: song.track.preview_url ?? null,
          uri: song.track.uri,
          played_at: song.played_at,
          amount: 1,
        };
      }
      return acc;
    }, {});

    const fnl = Object.values(recentSongs).sort((a, b) => b.amount - a.amount);

    return new SuccessResponse('Success', fnl).handleResponse(req, res);
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
