import BaseErrorResponse from './BaseErrorResponse';

export default class UnauthorizedResponse extends BaseErrorResponse {
	constructor(message = 'Invalid Permission', data: object = {}) {
		super(401, message, data);
	}
}
