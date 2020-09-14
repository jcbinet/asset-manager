export class BaseError extends Error {

  constructor(message: string, public code: string) {
    super(message);
  }

}
