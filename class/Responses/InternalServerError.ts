import BaseErrorResponse from './BaseErrorResponse';

// Internal Server Error (500)
export default class InternalServerError extends BaseErrorResponse {
  constructor(data: object) {
    super(500, "Oh no! There's an error from our side!", data);
  }
}
