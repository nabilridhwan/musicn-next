import { NextApiRequest, NextApiResponse } from 'next';

namespace RedirectHandler {
	export async function handleRedirect(
		req: NextApiRequest,
		res: NextApiResponse
	) {
		// TODO: Make an allowlist of allowed domains
		const redirectRoute = req.query.redirectTo;

		if (redirectRoute) {
			res.redirect(redirectRoute[0]);
		}
	}
}
