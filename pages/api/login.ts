import BodyValidationErrorResponse from '@/class/Responses/BodyValidationErrorResponse';
import InternalServerError from '@/class/Responses/InternalServerError';
import MethodNotAllowedResponse from '@/class/Responses/MethodNotAllowedResponse';
import SuccessResponse from '@/class/Responses/SuccessResponse';
import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import { getUserByEmailOrUsername } from '@/model/users';
import { createJWT } from '@/util/jwt';
import bcrypt from 'bcrypt';
import { setCookie } from 'cookies-next';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';

async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
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

			// Set a date 1 hour from now
			const expires = new Date(Date.now() + 1000 * 60 * 60);

			setCookie('token', token, {
				req,
				res,
				expires,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			});

			setCookie('signed_in', true, {
				req,
				res,
				expires,
				secure: process.env.NODE_ENV === 'production',
			});

			// User found
			return new SuccessResponse(
				'Logged in successfully',
				user
			).handleResponse(req, res);
		}

		return new MethodNotAllowedResponse().handleResponse(req, res);
	} catch (error: any) {
		if (error instanceof yup.ValidationError) {
			return new BodyValidationErrorResponse(
				error.errors.join(', ')
			).handleResponse(req, res);
		}

		return new InternalServerError(error.message).handleResponse(req, res);
	}
}

export default withSetupScript(withProtect(handler, 'has') as IHandler);
