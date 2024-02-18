import BaseErrorResponse from './BaseErrorResponse';

export default class BodyValidationErrorResponse extends BaseErrorResponse {
  constructor(message: string = 'Error validating body', data: object = {}) {
    super(400, message, data);
  }
}
