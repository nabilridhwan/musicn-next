// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../class/InternalServerError';
import SuccessResponse from '../../../class/SuccessResponse';
import { getAllUsers } from '../../../model/users';
import Cache from '../../../util/Cache';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	// Cache results for a minute
	// edgeCacheInSeconds(res, 60);

	// Cache results in the background and show the 'old' data
	Cache.revalidateInBackground(res);

	try {
		const data = await getAllUsers();
		return new SuccessResponse('Success', data).handleResponse(res);
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(res);
	}
}
