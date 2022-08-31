import BaseErrorResponse from './BaseErrorResponse';

export default class ConflictErrorResponse extends BaseErrorResponse {
	constructor(
		message = 'There was a problem requesting this: Conflict of data',
		data: object = {}
	) {
		super(409, message, data);
	}
}
