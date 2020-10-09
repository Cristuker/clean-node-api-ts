import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account-protocols';
import { AccountModel } from '../../../../domain/models/account-protocols';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getColletion('accounts');
    const result = await accountCollection.insertOne(accountData);
    const account = result.ops[0];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...accountWithoutId } = account;

    return { ...accountWithoutId, id: _id };
  }
}
