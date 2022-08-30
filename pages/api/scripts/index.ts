import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../class/Responses/InternalServerError';
import setup from '../../../SpotifyLinked';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		if (req.method === 'GET') {
            setup()
		}
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}
