import express from 'express'
import * as UseCases from '../domain/usecases'
import * as Global from "../global"
import { Account } from '../domain/entities'

export function startServer(db:Account[]){
    const server = express()
    server.use(express.json())
    server.post('/reset', (_, res) => {
        db = UseCases.Reset(db);
        res.status(200).send();
    })
    server.get('/balance', (req, res) => {
        const account_id = req.query.account_id
        if(!account_id || !Global.isNumeric(account_id as string) || typeof account_id != 'string') {
            return res.sendStatus(400);
        }
        const { errorCode, data } = UseCases.GetBalanceFromAccount(db, account_id);
        if(errorCode) {
            return res.status(
                Global.NON_EXISTING_ACCOUNT_ERR == errorCode ? 404 : 500
            ).send("0");
        }

        return res.status(200).send(String(data))
    })
    server.post('/event', (req, res) => {
        const event = req.body
        if(!event?.type || !event?.amount) {
            return res.sendStatus(400);
        }
        switch (event.type) {
            case 'deposit':
                const depositResult = UseCases.Deposit(db, event.destination, event.amount)
                if(depositResult.errorCode) {
                    return res.status(
                        depositResult.errorCode == Global.NON_EXISTING_ACCOUNT_ERR ? 404 : 500
                    ).send("0");
                }
                return res.status(200).send(depositResult.data)
            case 'transfer':
                var transferResult = UseCases.Transfer(db, event.origin, event.destination, event.amount)
                if(transferResult.errorCode) {
                    return res.status(
                        transferResult.errorCode == Global.NON_EXISTING_ACCOUNT_ERR ? 404 : 500
                    ).send("0");
                }
                return res.status(201).send(transferResult.data)
            case 'withdraw':
                const withdrawResult = UseCases.Withdraw(db, event.origin, event.amount);
                if(withdrawResult.errorCode) {
                    return res.status(
                        withdrawResult.errorCode == Global.NON_EXISTING_ACCOUNT_ERR ? 404 : 500
                    ).send("0")
                }
                return res.status(200).json(withdrawResult.data)
            default:
                res.sendStatus(500);
                break;
        }
    })
    server.listen('8080', () => console.log('Server running'))
}
