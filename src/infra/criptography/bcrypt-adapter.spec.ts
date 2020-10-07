import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}));
const salt = 12;

const makeSut = (): BcryptAdapter => {
    const bcryptAdapterStub = new BcryptAdapter(salt);
    return bcryptAdapterStub;
    
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt whit correct values', async ()=> {
        const bcryptAdapterStub = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await bcryptAdapterStub.encrypt('any_value');
        
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('Should return a hash on sucess', async ()=> {
        const bcryptAdapterStub = makeSut()

        const hashPass = await bcryptAdapterStub.encrypt('any_value');
        
        expect(hashPass).toBe('hash');
    })
})