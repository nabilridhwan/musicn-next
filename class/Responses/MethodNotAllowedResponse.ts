// Method not allowed

import BaseErrorResponse from './BaseErrorResponse';

export default class MethodNotAllowedResponse extends BaseErrorResponse {
	constructor() {
		super(405, 'Method not allowed', {});
	}
}
