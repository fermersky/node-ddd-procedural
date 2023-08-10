export class HttpError implements Error {
  name: string;
  message: string;
  status: number;
  stack?: string | undefined;

  constructor(name: string, message: string, status: number) {
    this.name = name;
    this.message = message;
    this.status = status;

    // because we are extending the built-in class
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class HttpUnauthorized extends HttpError {
  constructor(message = 'HttpUnauthorized') {
    super('HttpUnauthorized', message, 401);
  }
}

export class HttpNotFound extends HttpError {
  constructor(message = 'HttpNotFound') {
    super('HttpNotFound', message, 404);
  }
}

export class HttpBadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super('HttpBadRequest', message, 400);
  }
}
