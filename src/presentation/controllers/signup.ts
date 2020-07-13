import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../erros/missing-param-error';
import { badRequest } from '../helpers/http-helper';

export class SignUpController {
  // eslint-disable-next-line consistent-return
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email'];

    // eslint-disable-next-line no-restricted-syntax
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
