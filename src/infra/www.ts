import express from 'express'
import * as UseCases from '../domain/usecases'
import * as Global from "../global"

export function startServer(db:Array<UseCases.Account>){
    const server = express()
    server.post('/reset', (_, res) => {
        db = UseCases.Reset(db);
        res.status(200).send();
    })
    server.get('/balance', (req, res) => {
        const account_id = req.query.account_id as string
        if(!account_id || !Global.isNumeric(account_id)) {
            return res.status(400).send();
        }
        const {
            errorCode,
            data
        } = UseCases.GetBalanceFromAccount(account_id);

        if(errorCode) {
            if(errorCode == Global.NON_EXISTING_ACCOUNT_ERR) {
                return res.status(404).send("0");
            } else {
                return res.status(500).send();
            }
        }

        return res.status(200).send(data)
    })
    server.post('/event', (req, res) => {
        const event = req.body
        if(!event.type || !event.amount) {
            return res.status(400).send(0)
        }
        const {errorCode, data} = UseCases.handleEvent(event)
        switch (event.type) {
            case 'deposit':
                break;
            case 'transfer':
                break;
            case 'withdraw':
                break;
            default:
                break;
        }
    })
    server.listen('8080', () => console.log('Server running'))
}
