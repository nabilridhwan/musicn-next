import BaseErrorResponse from '@/class/Responses/BaseErrorResponse';
import InternalServerError from '@/class/Responses/InternalServerError';
import NotFoundResponse from '@/class/Responses/NotFoundResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import Spotify from '@/class/Spotify';
import withSetupScript from '@/middleware/withSetupScript';
import { getUserByUsername, updateProfilePictureUrl } from '@/model/users';
import Cache from '@/util/Cache';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
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
			return new NotFoundResponse().handleResponse(req, res);
		}

		const user = data[0];

		// Check if spotify_users is falsy
		if (!user.spotify_users) {
			return new BaseErrorResponse(
				400,
				'Spotify account not linked',
				{}
			).handleResponse(req, res);
		}

		let rtnData: {
			name: string;
			username: string;
			spotify_users: {
				name: string;
				profile_pic_url: string | null;
				spotify_userid: string;
			};
		} = {
			name: user.name || '',
			username: user.username,
			spotify_users: {
				name: user.spotify_users.name,
				profile_pic_url: user.spotify_users.profile_pic_url || null,
				spotify_userid: user.spotify_users.spotify_userid,
			},
		};

		// Get profile picture
		const spotify_userid = user.spotify_users.spotify_userid;
		const refresh_token = user.spotify_users?.refresh_token;
		const access_token = await Spotify.getAccessTokenFromRefreshToken(
			refresh_token
		);
		const spotify_user = await Spotify.getUserProfile(
			spotify_userid,
			access_token
		);

		if (spotify_user.images.length > 0) {
			// Update profile picture (in the background)
			updateProfilePictureUrl(user.user_id, spotify_user.images[0].url);
			rtnData.spotify_users.profile_pic_url = spotify_user.images[0].url;
		}

		return new SuccessResponse('Success', rtnData).handleResponse(req, res);
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}

export default withSetupScript(handler as IHandler);
