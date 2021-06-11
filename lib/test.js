const Xseal = require('./seal');

const generator = new Xseal.Generator("mitum");

const key = {
    key: "GCJINCZI7TCZ5LT5FYB5TNKA6IU5WCQABSE5OIVWFVPBN7HOINF73F4H:stellar-pub-v0.0.1",
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

const sender = "EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1";
const createAccountsFact = generator.createCreateAccountsFact(sender, createAccountsItems);

const createAccounts = generator.createOperation(createAccountsFact, "");

const signer = "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1";
createAccounts.addSign(signer);

const seal = generator.createSeal(signer, [createAccounts]);

const parser = Xseal.JSONParser;
// console.log(parser.toJSONString(seal));
parser.generateFile(seal, './example/seal.json');