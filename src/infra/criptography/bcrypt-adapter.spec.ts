import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt whit correct values', async ()=> {
        const salt = 12;
        const sut = new BcryptAdapter(salt);
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value');
        
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('Should return a hash on sucess', async ()=> {
        const salt = 12;
        const sut = new BcryptAdapter(salt);

        const hashPass = await sut.encrypt('any_value');
        
        expect(hashPass).toBe('hash');
    })
})