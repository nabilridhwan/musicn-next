import { NextApiResponse } from 'next';

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

	public handleResponse(res: NextApiResponse) {
		return res.status(this.status).json({
			status: this.status,
			error: this.error,
			message: this.message,
			data: this.data,
		});
	}
}
