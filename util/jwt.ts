import { sign, verify } from 'jsonwebtoken';

export function createJWT(user_id: any) {
	const payload = {
		user_id,
	};

	const options = {
		expiresIn: '1d',
	};

	const token = sign(payload, process.env.JWT_SECRET as string, options);
	return token;
}

export function verifyJWT(token: string) {
	return verify(token, process.env.JWT_SECRET as string);
}
