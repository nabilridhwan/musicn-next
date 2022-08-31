import withProtect from '@/middleware/withProtect';
import withSetupScript from '@/middleware/withSetupScript';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as yup from 'yup';
import BodyValidationErrorResponse from '../../class/Responses/BodyValidationErrorResponse';
import ConflictErrorResponse from '../../class/Responses/ConflictErrorResponse';
import InternalServerError from '../../class/Responses/InternalServerError';
import MethodNotAllowedResponse from '../../class/Responses/MethodNotAllowedResponse';
import SuccessResponse from '../../class/Responses/SuccessResponse';
import { addNewUser } from '../../model/users';
import parseUsername from '../../util/ParseUsername';

(BigInt.prototype as any).toJSON = function () {
	return Number(this);
};

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		if (req.method === 'POST') {
			console.log(req.body);
			const schema = yup.object().shape({
				name: yup.string().required('Display Name required'),
				email: yup.string().email().required('Email is required'),
				username: yup.string().required('Username required'),
				password: yup.string().required('Password required'),
				confirm_password: yup
					.string()
					.required('Confirm password required'),
			});

			const validatedData = await schema.validate(
				{
					name: req.body.name,
					email: req.body.email,
					username: parseUsername(req.body.username),
					password: req.body.password,
					confirm_password: req.body.confirm_password,
				},
				{ abortEarly: false }
			);

			let { name, username, password, email, confirm_password } =
				validatedData;

			// Compare password and confirm password
			const isPasswordCorrect = password === confirm_password;

			if (!isPasswordCorrect) {
				// Password incorrect
				return new BodyValidationErrorResponse(
					'Passwords do not match'
				).handleResponse(req, res);
			}

			password = await bcrypt.hash(password, 10);


			// Add a new user
			await addNewUser({
				name,
				username,
				email,
				password,
			});


			return new SuccessResponse(
				'User created successfully'
			).handleResponse(req, res);
		}

		return new MethodNotAllowedResponse().handleResponse(req, res);
	} catch (error: any) {
		console.log(error)
		if (error instanceof yup.ValidationError) {
			return new BodyValidationErrorResponse(
				error.errors.join(', ')
			).handleResponse(req, res);
		}

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.log(error)
			if (error.code === 'P2002') {
				return new ConflictErrorResponse(
					'User already exists'
				).handleResponse(req, res);
			}
		}

		return new InternalServerError(error.message).handleResponse(req, res);
	}
}



export default withSetupScript(withProtect(handler, 'has') as IHandler)