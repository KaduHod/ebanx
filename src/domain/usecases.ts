import { DbHandler, GetDb } from "../infra/db";
import { DefaultFunctionReturn } from "../main";

/*ENTITIES*/
export type Account = {
    account_id: string;
    balance: number;
};

export type Event = {
    type: "deposit" | "withdraw" | "transfer";
    amount: number;
    origin?: string;
    destination?: string;
};

/*ERRORS*/
export const NON_EXISTING_ACCOUNT_ERR = 1
export const INPUT_ERROR = 2
export const ALREADY_EXISTS = 3;


/*USE CASES*/
export function handleEvent(event: Event): DefaultFunctionReturn<any>{
    if(event.amount < 0 ){
        return {errorCode: INPUT_ERROR, data: null}
    }
    const database = GetDb();
    switch (event.type) {
        case 'deposit':
            if(!event.origin) {
                return {errorCode: INPUT_ERROR, data: null}
            }
            return Deposit(database, event.origin, event.amount);
        case 'transfer':
            if(!event.destination || !event.origin) {
                return {errorCode: INPUT_ERROR, data:null}
            }
            return Transfer(database, event.origin, event.destination, event.amount);
        case 'withdraw':
            if(!event.origin) {
                return {errorCode: INPUT_ERROR, data: null}
            }
            return Withdraw(database, event.origin, event.amount);
        default:
            return {errorCode: INPUT_ERROR, data: null}
    }
}

export function Reset(db: Array<Account>): Array<Account> {
    db = [];
    return db;
}

export function GetBalanceFromAccount(account_id:number|string): DefaultFunctionReturn<number> {
    return {data: 1, errorCode: null}
}
type DepositResult = {
    destination: {id:string, balance:number}
}
function Deposit(db:DbHandler, destination:string, amount: number): DefaultFunctionReturn<DepositResult|null> {
    let account:Account;
    let result:DepositResult;
    let {errorCode, data} = db.GetAccount(destination);
    if(errorCode == NON_EXISTING_ACCOUNT_ERR) {
        let {errorCode, data} = db.CreateAccount(destination, amount);

        if(errorCode) {
            return {errorCode, data:null};
        }

        account = data as Account;
        result = {
            destination: {
                    id: account.account_id,
                    balance: account.balance
            }
        }

        return { errorCode:null, data: result }
    }
    account = data as Account;
    const balance = amount + account.balance
    account.balance = balance
    const updateResult = db.UpdateAccount(account.account_id, account);
    if(updateResult.errorCode) {
        return {errorCode:updateResult.errorCode, data:null}
    }
    result = {
        destination: {
            id: account.account_id,
            balance: account.balance
        }
    }
    return {
        errorCode: null,
        data: result
    }
}
type TransferResult = {
    origin: {id:string, balance:number},
    destination:{id:string, balance:number}
}
function Transfer(db:DbHandler, origin:string, destination:string, amount: number): DefaultFunctionReturn<TransferResult|null> {
    return {
        errorCode: null,
        data: {
            destination: {
                id: "1",
                balance: 1
            },
            origin: {
                id:"2",
                balance:2
            }
        }
    }
}
type WithdrawResult = {
    origin: {
        id:string,
        balance:number
    }
}
function Withdraw(db:DbHandler, destination:string, amount: number): DefaultFunctionReturn<WithdrawResult|null> {
    return {
        errorCode: null,
        data: {
            origin: {
                id: "1",
                balance: 1
            }
        }
    }
}

