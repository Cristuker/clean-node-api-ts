import { SignUpController } from "./signup";
import {
    MissingParamError,
    InvalidParamError,
    ServerError,
} from "../../errors";
import {
    EmailValidator,
    AccountModel,
    AddAccount,
    AddAccountModel,
} from "./signup-protocols";

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async add(account: AddAccountModel): Promise<AccountModel> {
            const fakeAccount = {
                id: "valid_id",
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_pass",
            };
            return new Promise(resolve => resolve(fakeAccount));
        }
    }
    return new AddAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

interface SutTypes {
    sut: SignUpController;
    emailValidatorStb: EmailValidator;
    addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccount();
    const emailValidatorStb = makeEmailValidator();
    const sut = new SignUpController(emailValidatorStb, addAccountStub);
    return {
        sut,
        emailValidatorStb,
        addAccountStub,
    };
};

describe("SignUp Controller", () => {
    test("Should return 400 if no name is provided",async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: "ny_email@mail.com",
                password: "any_pass",
                passwordConfirmation: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("name"));
    });
    test("Should return 400 if no email is provided", async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: "any_name",
                password: "any_pass",
                passwordConfirmation: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("email"));
    });
    test("Should return 400 if no password is provided",async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: "any_name",
                email: "ny_email@mail.com",
                passwordConfirmation: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("password"));
    });
    test("Should return 400 if no passwordConfirmation is provided", async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: "any_name",
                email: "ny_email@mail.com",
                password: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new MissingParamError("passwordConfirmation")
        );
    });
    test("Should return 400 if emails is invalid",async () => {
        const { sut, emailValidatorStb } = makeSut();
        jest.spyOn(emailValidatorStb, "isValid").mockReturnValueOnce(false);
        const httpRequest = {
            body: {
                name: "any_name",
                email: "invalid_email@mail.com",
                password: "any_pass",
                passwordConfirmation: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError("email"));
    });
    test("Should return 400 if password confirmation fails",async () => {
        const { sut, emailValidatorStb } = makeSut();
        jest.spyOn(emailValidatorStb, "isValid").mockReturnValueOnce(false);
        const httpRequest = {
            body: {
                name: "any_name",
                email: "invalid_email@mail.com",
                password: "any_pass",
                passwordConfirmation: "invalid_password",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new InvalidParamError("passwordConfirmation")
        );
    });
    test("Should call EmailValidator whit correct email", () => {
        const { sut, emailValidatorStb } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStb, "isValid");
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_pass",
                passwordConfirmation: "any_pass",
            },
        };
        sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith("any_email@mail.com");
    });
    test("Should return 500 if emailValidator throws", async () => {
        const { sut, emailValidatorStb } = makeSut();
        jest.spyOn(emailValidatorStb, "isValid").mockImplementationOnce(() => {
            throw new Error();
        });
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_pass",
                passwordConfirmation: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
    test("Should addAccount whit correct values", async () => {
        const { sut, addAccountStub } = makeSut();
        const addSpy = jest.spyOn(addAccountStub, "add");
        const httpRequest = {
            body: {
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_pass",
                passwordConfirmation: "valid_pass",
            },
        };
        await sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_pass",
        });
    });
    test("Should return 500 if AddAccount throws", async () => {
        const { sut, addAccountStub } = makeSut();
        jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
            return new Promise((resolve,reject) => reject(new Error()));
        });
        const httpRequest = {
            body: {
                name: "any_name",
                email: "any_email@mail.com",
                password: "any_pass",
                passwordConfirmation: "any_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });
    test("Should return 200 if valid data is provided",async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: "valid_name",
                email: "valid_email@mail.com",
                password: "valid_pass",
                passwordConfirmation: "valid_pass",
            },
        };
        const httpResponse = await sut.handle(httpRequest);

        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            id: "valid_id",
            name: "valid_name",
            email: "valid_email@mail.com",
            password: "valid_pass",
        });
    });
});
