import { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import BaseErrorResponse from '../../../../class/Responses/BaseErrorResponse';
import InternalServerError from '../../../../class/Responses/InternalServerError';
import NotFoundResponse from '../../../../class/Responses/NotFoundResponse';
import SpotifyInvalidPermissionResponse from '../../../../class/Responses/SpotifyInvalidPermissionResponse';
import SuccessResponse from '../../../../class/Responses/SuccessResponse';
import Spotify from '../../../../class/Spotify';
import { getUserByUsername } from '../../../../model/users';
import Cache from '../../../../util/Cache';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	Cache.inEdgeServer(res, 30);
	try {
		const schema = yup.object().shape({
			username: yup.string().required('Username required'),
		});

		const validatedData = await schema.validate(
			{
				username: req.query.username,
			},
			{ abortEarly: false }
		);
		const data = (await getUserByUsername(validatedData.username)) as any;

		if (data.length === 0) {
			return new NotFoundResponse().handleResponse(res);
		}

		const user = data[0];

		// Check if spotify_users is falsy
		if (!user.spotify_users) {
			return new BaseErrorResponse(
				400,
				'Spotify account not linked',
				{}
			).handleResponse(res);
		}

		const refresh_token = user.spotify_users.refresh_token;
		const accessToken = await Spotify.getAccessTokenFromRefreshToken(
			refresh_token
		);

		let recentSongs = await Spotify.getRecentlyPlayedSongs(accessToken);

		console.log(recentSongs);

		recentSongs = recentSongs.map((song: any) => {
			return {
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
			};
		});

		return new SuccessResponse('Success', recentSongs).handleResponse(res);
	} catch (error: any) {
		if (error instanceof AxiosError) {
			if (
				error.response?.status === 401 ||
				error.response?.status === 403
			) {
				return new SpotifyInvalidPermissionResponse().handleResponse(
					res
				);
			}
		}

		return new InternalServerError(error.message).handleResponse(res);
	}
}
