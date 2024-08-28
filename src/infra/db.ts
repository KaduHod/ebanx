import { Account } from "../domain/usecases";
const db:Array<Account> = [];
export const GetDb = ():Array<Account> => {
    return db;
};
