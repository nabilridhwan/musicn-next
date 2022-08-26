import BaseErrorResponse from './BaseErrorResponse';

export default class NotFoundResponse extends BaseErrorResponse {
	constructor(data: object = {}) {
		super(404, 'Not found', data);
	}
}
