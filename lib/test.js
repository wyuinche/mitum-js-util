const Xseal = require('./seal');

const generator = new Xseal.Generator("mitum");

const key = {
    key: "GBYLIBJYZP6ZIYPFGOZSXSAPMRDA6XXRKNSMOMRCKNV2YZ35DGRPEQ35:stellar-pub-v0.0.1",
    weight: 100 
};
const keys = generator.createKeys([key], 100);

const amount = {
    big: 100,
    cid: "MCC"
};
const amounts = generator.createAmounts([amount]);

const createAccountsItem = generator.createCreateAccountsItem(keys, amounts);
const createAccountsItems = [];
createAccountsItems.push(createAccountsItem);

const sender = "8PdeEpvqfyL3uZFHRZG5PS3JngYUzFFUGPvCg29C2dBn:mca-v0.0.1";
const createAccountsFact = generator.createCreateAccountsFact(sender, createAccountsItems);

const createAccounts = generator.createOperation(createAccountsFact, "");

const signer = "L5GTSKkRs9NPsXwYgACZdodNUJqCAWjz2BccuR4cAgxJumEZWjok:btc-priv-v0.0.1";
createAccounts.addSign(signer);

const seal = generator.createSeal(signer, [createAccounts]);

const parser = Xseal.JSONParser;
console.log(parser.toJSONString(seal));