import { HttpRequest, HttpResponse } from '../protocols/http';
import { MissingParamError } from '../erros/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../erros/invalid-param-error';
import { ServerError } from '../erros/server-error';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  // eslint-disable-next-line consistent-return
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      // eslint-disable-next-line no-restricted-syntax
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);

      if (!isValid) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError(),
      };
    }
  }
}
