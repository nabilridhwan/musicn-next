// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../class/InternalServerError';
import { getAllUsers } from '../../../model/users';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		const data = await getAllUsers();
		res.status(200).json({ data });
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(res);
	}
}
