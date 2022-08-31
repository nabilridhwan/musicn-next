import { NextApiRequest, NextApiResponse } from 'next';

namespace RedirectHandler {
	const redirectKey = 'redirect';
	export function hasRedirect(req: NextApiRequest) {
		return !!req.query[redirectKey];
	}
	export async function handleRedirect(
		req: NextApiRequest,
		res: NextApiResponse
	) {
		// TODO: Make an allowlist of allowed domains
		const redirectRoute = req.query[redirectKey];

		if (redirectRoute) {
			return res.redirect(redirectRoute[0]);
		}
	}
}

export default RedirectHandler;
