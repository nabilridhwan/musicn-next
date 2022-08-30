import { AxiosError } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../../class/Responses/InternalServerError';
import Spotify from '../../../../class/Spotify';
import { linkSpotifyUser } from '../../../../model/users';
import APITokenHandler from '../../../../util/APITokenHandler';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		APITokenHandler.reject('none', req, res);

		// TODO: Reject if not signed in (APITokenHandler)
		const { error, code } = req.query;

		// Reject if error
		// if(error){

		// }

		if (code) {
			const { refresh_token, access_token } =
				await Spotify.getRefreshTokenFromCode(
					code,
					'http://localhost:3000/api/link/spotify/done'
				);

			const {
				email,
				display_name,
				country,
				images,
				id: spotify_userid,
			} = await Spotify.getUserProfile('noob', access_token);

			const { user_id } = APITokenHandler.extractDataFromToken(
				APITokenHandler.getToken(req)!
			) as APITokenHandler.TokenData;

			// Update spotify user
			await linkSpotifyUser({
				country,
				name: display_name,
				email,
				profile_pic_url: images[0].url || null,
				spotify_userid,
				refresh_token,
				user_id,
			});

			return res.redirect("/profile")

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
