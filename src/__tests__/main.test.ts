import { Deposit ,GetBalanceFromAccount, Reset, Transfer, Withdraw } from "../domain/usecases"
import { Account } from "../domain/entities"
import * as Global from '../global'

test('UseCase :: Reset', () => {
    let db:Account[] = [{account_id:"1", balance:10}]
    db = Reset(db)
    expect(db.length).toBe(0)
})
test('UseCase :: Get balance for non-existing account', () => {
    const db:Account[] = [];
    const {errorCode, data} = GetBalanceFromAccount(db, "1")
    expect(errorCode).toBeTruthy();
    expect(data).toBe(0)
})
test('UseCase :: Create account with initial balance', () => {
    const db:Account[] = [];
    const {errorCode, data} = Deposit(db, "100", 10);
    expect(errorCode).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data?.destination.balance).toBe(10)
})
test('UseCase :: Deposit into existing acocunt', () => {
    const db:Account[] = [{account_id:"100", balance:10}]
    const {errorCode, data} = Deposit(db, "100", 10);
    expect(errorCode).toBeFalsy();
    expect(data?.destination).toBeTruthy();
    if(data?.destination) {
        expect(data.destination.balance).toBe(20)
    }
})
test('UseCase :: Get balance for existing account', () => {
    const db:Account[] = [{account_id:"100", balance:20}]
    const {errorCode, data} = GetBalanceFromAccount(db, "100");
    expect(errorCode).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data).toBe(20)
})
test('UseCase :: Withdraw from existing account', () => {
    const db:Account[] = [{account_id:"105", balance:20}];
    const {errorCode, data} = Withdraw(db, "105", 5)
    expect(errorCode).toBeFalsy();
    expect(data?.origin).toBeTruthy();
    if(data?.origin) {
        expect(data.origin.balance).toBe(15)
        expect(data.origin.id).toBe("105")
    }
})
test('UseCase :: Transfer from existing account', () => {
    const db:Account[] = [{account_id:"100", balance:15}]
    const {errorCode, data} = Transfer(db, "100", "300", 15)
    expect(errorCode).toBeFalsy();
    expect(data?.destination?.id).toBeTruthy();
    expect(data?.origin?.id).toBeTruthy();
    expect(data?.destination?.balance).toBe(15);
    expect(data?.origin?.balance).toBe(0);

});
test('UseCase :: Transfer from non existing account', () => {
    const db:Account[] = [{account_id:"100", balance:1000000}];
    const {errorCode, data} = Transfer(db, "200", "100", 300);
    expect(data).toBeFalsy();
    expect(errorCode).toBeTruthy();
    expect(errorCode).toBe(Global.NON_EXISTING_ACCOUNT_ERR)
})
