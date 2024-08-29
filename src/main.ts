import { GetDb } from "./infra/db"
import { startServer } from "./infra/www"

const main = async () => {
    console.log("############### Starting home test ###############")
    startServer(GetDb())
}
main();
