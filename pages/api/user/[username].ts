import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import BaseErrorResponse from '../../../class/BaseErrorResponse';
import InternalServerError from '../../../class/InternalServerError';
import NotFoundResponse from '../../../class/NotFoundResponse';
import SuccessResponse from '../../../class/SuccessResponse';
import { getUserByUsername_public } from '../../../model/users';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		const schema = yup.object().shape({
			username: yup.string().required('Username required'),
		});

		const validatedData = await schema.validate(
			{
				username: req.query.username,
			},
			{ abortEarly: false }
		);
		const data = (await getUserByUsername_public(
			validatedData.username
		)) as any;

		if (data.length === 0) {
			return new NotFoundResponse().handleResponse(res);
		}

		const user = data[0];

		// Check if spotify_users is falsy
		if (!user.spotify_users) {
			return new BaseErrorResponse(
				400,
				'Spotify account not linked',
				{}
			).handleResponse(res);
		}

		return new SuccessResponse('Success', user).handleResponse(res);
	} catch (error: any) {
		return new InternalServerError(error.message).handleResponse(res);
	}
}
