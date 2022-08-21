import BaseErrorResponse from './BaseErrorResponse';

export default class BodyValidationErrorResponse extends BaseErrorResponse {
	constructor(data: object) {
		super(400, 'Error validating body', data);
	}
}
