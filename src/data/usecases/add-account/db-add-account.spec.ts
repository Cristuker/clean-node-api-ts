import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account'

interface SutTypes {
    sut: DbAddAccount
    encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
    class EncrypterStub{
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'))
        }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddAccount(encrypterStub);
    return {
        sut,
        encrypterStub
    }
}

describe('Db add account usecase',() => {
    test('Should call encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut()
        const encryptSpy = jest.spyOn(encrypterStub,'encrypt')
        const accountData = {
            name:'valid_name',
            email:'valid_email',
            password:'valid_pass'
        }
        await sut.add(accountData);
        expect(encryptSpy).toHaveBeenCalledWith('valid_pass')
    })
})