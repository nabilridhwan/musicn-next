import { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import BaseErrorResponse from '../../../../class/BaseErrorResponse';
import InternalServerError from '../../../../class/InternalServerError';
import NotFoundResponse from '../../../../class/NotFoundResponse';
import SpotifyInvalidPermissionResponse from '../../../../class/SpotifyInvalidPermissionResponse';
import SuccessResponse from '../../../../class/SuccessResponse';
import { getUserByUsername } from '../../../../model/users';
import Cache from '../../../../util/Cache';
import Spotify from '../../../../util/Spotify';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	Cache.inEdgeServer(res, 10);
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

		let currentlyPlayingSong = await Spotify.getCurrentlyPlayingSong(
			accessToken
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
				uri: cps_data.uri,
			};
		}

		return new SuccessResponse(
			'Success',
			currentlyPlayingSong
		).handleResponse(res);
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
