import InternalServerError from '@/class/Responses/InternalServerError';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import { deleteSpotifyUserByUserID } from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		if (req.method === 'GET') {
			const data = APITokenHandler.extractDataFromToken(
				APITokenHandler.getToken(req)!
			);

			await deleteSpotifyUserByUserID(data?.user_id);
			res.redirect('/profile');
		}
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}

export default withSetupScript(withProtect(handler) as IHandler);
