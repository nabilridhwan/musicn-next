import { deleteCookie } from 'cookies-next';
import { NextApiRequest, NextApiResponse } from 'next';
import UnauthorizedResponse from '../class/Responses/UnauthorizedResponse';
import { verifyJWT } from './jwt';

namespace APITokenHandler {
	const tokenKey = 'token';

	type REJECT_WHEN = 'none' | 'has' | 'invalid' | 'expired';

	export type TokenData = {
		user_id: string;
	}

	export function getToken(req: NextApiRequest) {
		return req.cookies[tokenKey];
	}

	export function hasAPIToken(req: NextApiRequest) {
		return !!req.cookies[tokenKey];
	}

	export function reject(
		rejectWhen: REJECT_WHEN,
		req: NextApiRequest,
		res: NextApiResponse
	) {
		switch (rejectWhen) {
			case 'none':
				if (!hasAPIToken(req)) {
					return new UnauthorizedResponse(
						'No token provided'
					).handleResponse(req, res);
				}
				break;
			case 'has':
				if (hasAPIToken(req)) {
					return new UnauthorizedResponse(
						'Token provided'
					).handleResponse(req, res);
				}
				break;
		}
	}

	export function extractDataFromToken(token: string) {
		try {
			const data = verifyJWT(token);
			return data;
		} catch (error) {
			console.log('Error in extractDataFromToken', error);
		}
	}

	export function removeToken(req: NextApiRequest ,res: NextApiResponse){
		deleteCookie(tokenKey, {
			req,
			res
		})
	}
}

export default APITokenHandler;
