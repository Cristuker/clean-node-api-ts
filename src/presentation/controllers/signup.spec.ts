import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';
import { AccountModel } from '../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account';

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'validId',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub();
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

interface SutTypes {
  sut: SignUpController,
  emailValidatorStb: EmailValidator,
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const emailValidatorStb = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStb, addAccountStub);
  return {
    sut,
    emailValidatorStb,
    addAccountStub
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'ny_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'ny_email@mail.com',
        passwordConfirmation: 'any_pass',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'ny_email@mail.com',
        password: 'any_pass',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
  });
  test('Should return 400 if emails is invalid', () => {
    const { sut, emailValidatorStb } = makeSut();
    jest.spyOn(emailValidatorStb, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('Should return 400 if password confirmation fails', () => {
    const { sut, emailValidatorStb } = makeSut();
    jest.spyOn(emailValidatorStb, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'invalid_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
  });
  test('Should call EmailValidator whit correct email', () => {
    const { sut, emailValidatorStb } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStb, 'isValid');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass',
      },
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
  test('Should return 500 if emailValidator throws', () => {

    const { sut, emailValidatorStb } = makeSut();
    jest.spyOn(emailValidatorStb, 'isValid').mockImplementationOnce(() => { throw new Error() })
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('Should addAccount whit correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass',
      },
    };
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenLastCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_pass',
    })
  });
});
