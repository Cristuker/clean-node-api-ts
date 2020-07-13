import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../erros/missing-param-error';

export class SignUpController {
  // eslint-disable-next-line consistent-return
  handle(httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }
  }
}
