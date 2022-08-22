// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../class/InternalServerError';
import SuccessResponse from '../../../class/SuccessResponse';
import { getNewUsers } from '../../../model/users';
import { setCacheOptions } from '../../../util/setCacheOptions';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	setCacheOptions(res);
	try {
		const data = await getNewUsers(3);
		return new SuccessResponse('Success', data).handleResponse(res);
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(res);
	}
}
