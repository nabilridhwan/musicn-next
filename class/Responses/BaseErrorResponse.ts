import BaseResponse from './BaseResponse';

export default class BaseErrorResponse extends BaseResponse {
	constructor(status: number, message: string, data: object) {
		super(status, message, data);
		this.error = true;
	}
}
