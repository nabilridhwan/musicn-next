export namespace KnownClientError {
  export function encodeError<T extends {name: string; desc: string}>(
    error: T,
  ) {
    // Return base 64
    return Buffer.from(JSON.stringify(error)).toString('base64');
  }

  export function decodeError<T extends {name: string; desc: string}>(
    error: string,
  ): T {
    // Return JSON
    return JSON.parse(Buffer.from(error, 'base64').toString('utf-8'));
  }
}
