import { NextApiRequest, NextApiResponse } from 'next';
import RedirectHandler from '../../util/RedirectHandler';

export default class BaseResponse {
	public error: boolean = false;
	constructor(
		public status: number,
		public message: string,
		public data: object
	) {
		if (status >= 400) {
			this.error = true;
		}
	}

	public handleResponse(req: NextApiRequest, res: NextApiResponse) {
		if (RedirectHandler.hasRedirect(req)) {
			RedirectHandler.handleRedirect(req, res);
		} else {
			return res.status(this.status).json({
				status: this.status,
				error: this.error,
				message: this.message,
				data: this.data,
			});
		}
	}
}
