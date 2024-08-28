import { Account, ALREADY_EXISTS, NON_EXISTING_ACCOUNT_ERR } from "../domain/usecases";
import { DefaultFunctionReturn } from "../main";
export interface DbHandler {
    GetAccount(account_id:string):DefaultFunctionReturn<Account|null>
    CreateAccount(account_id:string, amount:number):DefaultFunctionReturn<Account|null>
    UpdateAccount(account_id:string, values:Account):DefaultFunctionReturn<Account|null>
}
const db:Array<Account> = [];
export const GetDb = ():DbHandler => {
    const GetAccount = (account_id:string):DefaultFunctionReturn<Account|null> => {
        const account = db.find(a => a.account_id === account_id)
        if(!account) {
            return {errorCode: NON_EXISTING_ACCOUNT_ERR, data:null}
        }
        return {errorCode:null, data:account}
    }
    const CreateAccount = (account_id:string, amount:number = 0):DefaultFunctionReturn<Account|null> => {
        const alredyCreated = !!db.find(a => a.account_id == account_id)
        if(alredyCreated) {
            return {errorCode: ALREADY_EXISTS, data:null}
        }
        const account = {account_id, balance:amount}
        db.push(account)
        return {errorCode:null, data:account}
    }
    const UpdateAccount = (account_id:string, values:Account):DefaultFunctionReturn<Account|null> => {
        const getAccountResult = GetAccount(account_id)
        if(getAccountResult.errorCode) {
            return {errorCode:getAccountResult.errorCode, data:null}
        }
        const updated = {...values, account_id} as Account
        for(let i = 0; i<= db.length;i++) {
            if(db[i].account_id == account_id) {
                db[i] = updated
            }
        }
        return {errorCode:null, data: updated}
    }
    return {GetAccount, CreateAccount, UpdateAccount}
};
