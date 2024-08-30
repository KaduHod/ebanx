const resetTest = async () => {
    const res = await post('reset');
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toBe("OK");
};
const getBalanceForNonExistingAccount = async () => {
    const res = await get('balance?account_id=1234');
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-type')).toBe('text/plain; charset=utf-8');
    const body = await res.text();
    expect(body).toBe("0");
};
const createAccountWithInitialBalance = async () => {
    const res = await post('event', {
        type: 'deposit',
        destination: '100',
        amount: 10
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
        destination: { id: "100", balance: 10 }
    });
};
const getBalanceForExistingAccount = async () => {
    const res = await get('balance?account_id=100');
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toBe("20");
};
const withdrawFromExistingAccount = async () => {
    const res = await post('event', {
        type: 'withdraw',
        origin: "100",
        amount: 5
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
        origin: { id: "100", balance: 15 }
    });
};
const depositIntoExistingAccount = async () => {
    const res = await post('event', {
        type: 'deposit',
        destination: '100',
        amount: 10,
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
        destination: { id: "100", balance: 20 }
    });
};
const withdrawFromNonExistingAccount = async () => {
    const res = await post('event', {
        type:"withdraw", origin:"200", amount:10
    })
    expect(res.status).toBe(404)
    const body = await res.text()
    expect(body).toBe("0")
}
const transferFromExistingAccount = async () => {
    const res = await post('event', {
        type:"transfer", origin:"100", destination:"300", amount:15
    })
    expect(res.status).toBe(201)
    const body = await res.json();
    expect(body).toMatchObject({
        origin:{id:"100", balance:0},
        destination:{id:"300", balance:15}
    })
}
const transferFromNonExistingAcocunt = async () => {
    const res = await post('event', {
        type:"transfer", origin:"200", destination:"300", amount:15
    })
    expect(res.status).toBe(404)
    const body = await res.text();
    expect(body).toBe("0")
}
const post = (path:string, data?:any) =>{
    const config:{[key:string]:any} = {method:"POST", headers: {'Content-type':'application/json'}}
    if(data) {
        config.body = JSON.stringify(data)
    }
    return fetch(`http://localhost:8080/${path}`, config)
};
const get = (path:string) => fetch(`http://localhost:8080/${path}`);
test('API TEST', async () => {
    await resetTest();
    await getBalanceForNonExistingAccount();
    await createAccountWithInitialBalance();
    await depositIntoExistingAccount();
    await getBalanceForExistingAccount();
    await withdrawFromNonExistingAccount();
    await withdrawFromExistingAccount();
    await transferFromExistingAccount();
    await transferFromNonExistingAcocunt();
})
