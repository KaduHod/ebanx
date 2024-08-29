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
