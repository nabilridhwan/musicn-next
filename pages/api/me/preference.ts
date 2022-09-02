import ConflictErrorResponse from '@/class/Responses/ConflictErrorResponse';
import InternalServerError from '@/class/Responses/InternalServerError';
import MethodNotAllowedResponse from '@/class/Responses/MethodNotAllowedResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import { updatePreferences } from '@/model/preferences';
import APITokenHandler from '@/util/APITokenHandler';
import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
		if (req.method === 'PUT') {
			// Filter out fields that are not allowed to be updated
			const updateData = req.body;
			const allowedFields = ['top', 'recent', 'current', 'account'];

			const token = APITokenHandler.getToken(req);
			const dataFromToken: any =
				APITokenHandler.extractDataFromToken(token);

			// Filter out allowed fields
			const filteredUpdateData = Object.keys(updateData).reduce<{
				[prop: string]: any;
			}>((acc, key) => {
				if (allowedFields.includes(key)) {
					acc[key] = updateData[key];
				}
				return acc;
			}, {});

			console.log(filteredUpdateData);

			await updatePreferences(
				dataFromToken.user_id,
				filteredUpdateData as Preferences
			);

			return new SuccessResponse(
				'Success updating preferences',
				updateData
			).handleResponse(req, res);
		}

		return new MethodNotAllowedResponse().handleResponse(req, res);
	} catch (error: any) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.log(error);
			if (error.code === 'P2002') {
				return new ConflictErrorResponse(
					'User with that username or email already exists'
				).handleResponse(req, res);
			}
		}
		return new InternalServerError(error.message).handleResponse(req, res);
	}
}

export default withSetupScript(withProtect(handler) as IHandler);
