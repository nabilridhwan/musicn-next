import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../class/Responses/InternalServerError';
import APITokenHandler from '../../util/APITokenHandler';
import RedirectHandler from '../../util/RedirectHandler';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
        APITokenHandler.removeToken(req, res);
        RedirectHandler.handleRedirect(req, res);
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}