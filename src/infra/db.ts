import { Account } from "../domain/usecases";
import { DefaultFunctionReturn } from "../main";
export interface DbHandler {
    GetAccount(account_id:string):DefaultFunctionReturn<Account|null>
    CreateAccount(account_id:string, amount:number):DefaultFunctionReturn<Account|null>
    UpdateAccount(account_id:string, values:Account):DefaultFunctionReturn<Account|null>
}
const db:Array<Account> = [];
export const GetDb = ():Array<Account> => {
    return db;
};
