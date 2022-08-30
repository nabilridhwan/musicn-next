import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../../class/Responses/InternalServerError';
import Spotify from '../../../../class/Spotify';
import APITokenHandler from '../../../../util/APITokenHandler';

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
			res.redirect(
				Spotify.getUserAuthorizationUrl(
					SCOPE,
					'http://localhost:3000/api/link/spotify/done'
				)
			);
		}
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}
