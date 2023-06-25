import BaseErrorResponse from './BaseErrorResponse';

export default class SpotifyInvalidPermissionResponse extends BaseErrorResponse {
  constructor(data: object = {}) {
    super(401, 'Invalid permission', data);
  }
}
