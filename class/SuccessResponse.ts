import BaseResponse from './BaseResponse';

export default class SuccessResponse extends BaseResponse {
	constructor(message: string = 'Success', data: object = {}) {
		super(200, message, data);
	}
}
