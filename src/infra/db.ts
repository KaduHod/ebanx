import { Account } from "../domain/entities";
const db:Array<Account> = [];
export const GetDb = ():Array<Account> => {
    return db;
};
