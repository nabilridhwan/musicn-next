import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../class/Responses/InternalServerError';
import { deleteSpotifyUserByUserID } from '../../../model/users';
import APITokenHandler from '../../../util/APITokenHandler';

const SCOPE =
	'user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		// TODO: Reject if not signed in
		APITokenHandler.reject('none', req, res);

		if (req.method === 'GET') {
			const { user_id } = APITokenHandler.extractDataFromToken(
				APITokenHandler.getToken(req)!
			) as APITokenHandler.TokenData;

			await deleteSpotifyUserByUserID(user_id);
			res.redirect('/profile');
		}
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}
