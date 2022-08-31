import ConflictErrorResponse from '@/class/Responses/ConflictErrorResponse';
import InternalServerError from '@/class/Responses/InternalServerError';
import MethodNotAllowedResponse from '@/class/Responses/MethodNotAllowedResponse';
import NotFoundResponse from '@/class/Responses/NotFoundResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import { getUserById, updateOnlyUser } from '@/model/users';
import APITokenHandler from '@/util/APITokenHandler';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	try {
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

		if (req.method === 'PUT') {
			// Filter out fields that are not allowed to be updated
			const updateData = req.body;
			const allowedFields = ['name', 'email', 'username', 'password'];

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

			if (filteredUpdateData.password) {
				filteredUpdateData.password = await bcrypt.hash(
					filteredUpdateData.password,
					10
				);
			}

			console.log(filteredUpdateData);

			await updateOnlyUser(dataFromToken.user_id, filteredUpdateData);

			return new SuccessResponse('Success', updateData).handleResponse(
				req,
				res
			);
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
