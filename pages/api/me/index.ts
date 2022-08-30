import type { NextApiRequest, NextApiResponse } from 'next';
import InternalServerError from '../../../class/Responses/InternalServerError';
import NotFoundResponse from '../../../class/Responses/NotFoundResponse';
import SuccessResponse from '../../../class/Responses/SuccessResponse';
import { getUserById, updateOnlyUser } from '../../../model/users';
import APITokenHandler from '../../../util/APITokenHandler';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		APITokenHandler.reject('none', req, res);

		if (req.method === 'GET') {
			if (APITokenHandler.hasAPIToken(req)) {
				const token = APITokenHandler.getToken(req);
				const dataFromToken: any = APITokenHandler.extractDataFromToken(
					token!
				);

				const user = await getUserById(dataFromToken!.user_id);

				if (!user) {
					return new NotFoundResponse().handleResponse(req, res);
				}

				return new SuccessResponse('Success', user).handleResponse(
					req,
					res
				);
			}
		}

		if (req.method === 'POST') {
			if (APITokenHandler.hasAPIToken(req)) {
				const updateData = req.body;
				// TODO: Filter out fields that are not allowed to be updated
				const allowedFields = ['name', 'email'];

				const token = APITokenHandler.getToken(req);
				const dataFromToken: any = APITokenHandler.extractDataFromToken(
					token!
				);

				// Filter out allowed fields
				const filteredUpdateData = Object.keys(updateData).reduce(
					(acc, key) => {
						if (allowedFields.includes(key)) {
							acc[key] = updateData[key];
						}

						return acc;
					},
					{}
				);

				updateOnlyUser(dataFromToken!.user_id, filteredUpdateData);

				return new SuccessResponse(
					'Success',
					updateData
				).handleResponse(req, res);
			}
		}
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}
