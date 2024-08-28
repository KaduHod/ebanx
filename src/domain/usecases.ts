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

export function GetBalanceFromAccount(account_id:number|string): Global.DefaultFunctionReturn<number> {
    return {data: 1, errorCode: null}
}
type DepositResult = {
    destination: {id:string, balance:number}
}
function Deposit(db:Array<Account>, destination:string, amount: number): Global.DefaultFunctionReturn<DepositResult|null> {
    let account:Account|undefined;
    account = db.find(row => row.account_id == destination)
    if(!account) {
        account = {account_id: destination, balance: amount}
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
    account.balance = account.balance + amount
    return {
        errorCode: null,
        data: {
            destination: {
                id: account.account_id,
                balance: account.balance
            }
        }
    }
}
type TransferResult = {
    origin: {id:string, balance:number},
    destination:{id:string, balance:number}
}
function Transfer(db:Array<Account>, origin:string, destination:string, amount: number): Global.DefaultFunctionReturn<TransferResult|null> {
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
function Withdraw(db:Array<Account>, destination:string, amount: number): Global.DefaultFunctionReturn<WithdrawResult|null> {
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

