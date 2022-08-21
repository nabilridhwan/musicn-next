import BaseResponse from './BaseResponse';

export default class TokenResponse extends BaseResponse {
	constructor(token: string) {
		const data = { token };
		super(200, 'Successful log-in', data);
	}
}
