import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import BodyValidationErrorResponse from '../../class/BodyValidationErrorResponse';
import InternalServerError from '../../class/InternalServerError';
import MethodNotAllowedResponse from '../../class/MethodNotAllowedResponse';
import TokenResponse from '../../class/TokenResponse';
import { getUserByEmailOrUsername } from '../../model/users';
import { createJWT } from '../../util/jwt';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		if (req.method === 'POST') {
			const schema = yup.object().shape({
				username: yup.string().required('Username required'),
				password: yup.string().required('Password required'),
			});

			const validatedData = await schema.validate(
				{
					username: req.body.username,
					password: req.body.password,
				},
				{ abortEarly: false }
			);

			const { username, password } = validatedData;

			const data = await getUserByEmailOrUsername(username);

			if (data.length === 0) {
				// User not found
				return res.status(404).json({
					message: 'User not found',
				});
			}

			const user = data[0];

			// Compare password
			const isPasswordCorrect = await bcrypt.compare(
				password,
				user.password
			);

			if (!isPasswordCorrect) {
				// Password incorrect
				return res.status(401).json({
					message: 'Password incorrect',
				});
			}

			const token = createJWT(user.user_id);

			// User found

			return new TokenResponse(token).handleResponse(res);
		}

		return new MethodNotAllowedResponse().handleResponse(res);
	} catch (error: any) {
		if (error instanceof yup.ValidationError) {
			return new BodyValidationErrorResponse(error.errors).handleResponse(
				res
			);
		}

		return new InternalServerError(error.message).handleResponse(res);
	}
}
