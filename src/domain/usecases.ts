import * as Global from "../global";
import { GetDb } from "../infra/db";

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

/*USE CASES*/
export function handleEvent(event: Event): Global.DefaultFunctionReturn<any>{
    if(event.amount < 0 ){
        return {errorCode: Global.INPUT_ERROR, data: null}
    }
    const database = GetDb();
    switch (event.type) {
        case 'deposit':
            if(!event.origin) {
                return {errorCode: Global.INPUT_ERROR, data: null}
            }
            return Deposit(database, event.origin, event.amount);
        case 'transfer':
            if(!event.destination || !event.origin) {
                return {errorCode: Global.INPUT_ERROR, data:null}
            }
            return Transfer(database, event.origin, event.destination, event.amount);
        case 'withdraw':
            if(!event.origin) {
                return {errorCode: Global.INPUT_ERROR, data: null}
            }
            return Withdraw(database, event.origin, event.amount);
        default:
            return {errorCode: Global.INPUT_ERROR, data: null}
    }
}

export function Reset(db: Array<Account>): Array<Account> {
    db = [];
    return db;
}

export function GetBalanceFromAccount(db: Array<Account>, account_id:string): Global.DefaultFunctionReturn<number> {
    const account = db.find(row => row.account_id)
    if(!account) {
        return {
            errorCode: Global.NON_EXISTING_ACCOUNT_ERR,
            data: 0
        }
    }
    return {data: account.balance, errorCode: null}
}
type DepositResult = {
    destination: {id:string, balance:number}
}
export function Deposit(db:Array<Account>, destination:string, amount: number): Global.DefaultFunctionReturn<DepositResult|null> {
    const accountI = db.findIndex(row => row.account_id == destination)
    if(accountI < 0) {
        const account:Account = {account_id: destination, balance: amount}
        db.push(account);
        return {
            errorCode:null,
            data: {
                destination: {
                    id: account.account_id,
                    balance: account.balance
                }
            }
        }
    }
    db[accountI].balance = db[accountI].balance + amount
    return {
        errorCode: null,
        data: {
            destination: {
                id: db[accountI].account_id,
                balance: db[accountI].balance
            }
        }
    }
}
type TransferResult = {
    origin:{id:string, balance:number},
    destination:{id:string, balance:number}
}
export function Transfer(db:Array<Account>, origin:string, destination:string, amount: number): Global.DefaultFunctionReturn<TransferResult|null> {
    const originAccountI = db.findIndex(row => row.account_id == origin)
    if(originAccountI < 0) {
        return {
            errorCode: Global.NON_EXISTING_ACCOUNT_ERR,
            data: null
        }
    }
    if(db[originAccountI].balance < amount) {
        return {
            errorCode: Global.INPUT_ERROR,
            data: null
        }
    }
    let destAccountI = db.findIndex(row => row.account_id == destination)
    if(destAccountI < 0) {
        const auxCreateAccount = Deposit(db, destination, 0)
        if(auxCreateAccount.errorCode) {
            return {
                errorCode: auxCreateAccount.errorCode,
                data: null
            }
        }
        destAccountI = db.findIndex(row => row.account_id == destination)
    }
    /*Filas Asyncronas*/
    db[originAccountI].balance = db[originAccountI].balance - amount;
    db[destAccountI].balance = db[destAccountI].balance + amount;
    return {
        errorCode: null,
        data: {
            destination: {
                id:db[destAccountI].account_id,
                balance:db[destAccountI].balance
            },
            origin: {
                id:db[originAccountI].account_id,
                balance:db[originAccountI].balance
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
export function Withdraw(db:Array<Account>, destination:string, amount: number): Global.DefaultFunctionReturn<WithdrawResult|null> {
    const accountI = db.findIndex(row => row.account_id == destination)
    if(accountI < 0) {
        return {
            errorCode: Global.NON_EXISTING_ACCOUNT_ERR,
            data: null
        }
    }
    if(db[accountI].balance < amount) {
        return {
            errorCode: Global.INPUT_ERROR,
            data: null
        }
    }
    db[accountI].balance = db[accountI].balance - amount
    return {
        errorCode: null,
        data: {
            origin: {
                id: db[accountI].account_id,
                balance: db[accountI].balance
            }
        }
    }
}

