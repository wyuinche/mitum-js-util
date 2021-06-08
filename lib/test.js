const keysdk = require('./key');
const oper = require('./operation');
const hint = require('./hint');
const bs58 = require('bs58');
const sign = require('./sign');

// const key =  new keysdk.Key("27LZo3wxW5T9VH5Da1La9bCSg1VfnaKtNvb3Gmg115N6X-0113:0.0.1", 100);
// const lkey = [key];

// const keys = new keysdk.Keys(lkey, 100);

// const amount = new oper.Amount(100, "MCC");
// const amounts = [amount];

// const item = new oper.CreateAccountsItem(
//     hint.MC_CREATE_ACCOUNTS_SINGLE_AMOUNT, keys, amounts);
// const items = [item];

// const createAccountsFact = new oper.CreateAccountsFact(
//     "8AwAwFAaboopKDH7Nriq9Sq2eb2xjThMBFtWWCt3iebG-a000:0.0.1",
//     items
// );

const fact_hash = "HQHU6HN9yKLpq29Wg2EcM4Lft9qzAXTMQWu9tJLGjXkA";
const netID = "mitum";

const fact_sign = sign.newFactSign(
    Buffer.concat([
        bs58.decode(fact_hash),
        Buffer.from(netID)
    ]),
    "SCDGC3NKYMZGJUW4KW7XILUNQ3CFOWUJBT2363CVDS7DHZAXPT3H4R72-0110:0.0.1"
);

// console.log(fact_sign);
// console.log(bs58.encode(fact_sign.sign));
// console.log(fact_sign.buffer());