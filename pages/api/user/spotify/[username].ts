import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import BaseErrorResponse from '../../../../class/BaseErrorResponse';
import InternalServerError from '../../../../class/InternalServerError';
import NotFoundResponse from '../../../../class/NotFoundResponse';
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
	Cache.revalidateInBackground(res);
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

		const data = await getUserByUsername(validatedData.username);

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

		const spotify_userid = user.spotify_users.spotify_userid;
		const refresh_token = user.spotify_users.refresh_token;

		const access_token = await Spotify.getAccessTokenFromRefreshToken(
			refresh_token
		);
		const spotify_user = await Spotify.getUserProfile(
			spotify_userid,
			access_token
		);

		// Filter out items needed
		const rtnData = {
			display_name: spotify_user.display_name,
			url: spotify_user.external_urls.spotify,
			profile_pic_url: spotify_user.images[0]?.url ?? null,
			followers: spotify_user.followers.total,
		};

		return new SuccessResponse('Success', rtnData).handleResponse(res);
	} catch (error: any) {
		console.log(error);
		return new InternalServerError(error.message).handleResponse(res);
	}
}