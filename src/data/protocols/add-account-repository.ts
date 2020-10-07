import { AddAccountModel } from '../../domain/usecases/add-account-protocols';
import { AccountModel } from '../../domain/models/account-protocols';

export interface AddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
