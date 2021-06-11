const Xseal = require('./seal');

const generator = new Xseal.Generator("mitum");

const key = {
    key: "GC4G2ET5M3G7UVYMYMJILSMQAFTKXTGQ2ZGP4XZ2YK5N3LBMWBXZ3VQ6:stellar-pub-v0.0.1",
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


const key2 = {
    key: "GBQBJVNKQZ7J4OSTKRUZTNZKDBR2EAJPRAV6H6GKMXQLXOPIBDFODLR4:stellar-pub-v0.0.1",
    weight: 100
};
const keys2 = generator.createKeys([key2], 100);

const target = "BaY4pBBTXeQVeGEUTcKiBEZ4tS1M3F4hys32da81yoi:mca-v0.0.1";
const keyUpdaterFact = generator.createKeyUpdaterFact(target, "MCC", keys2);

const keyUpdater = generator.createOperation(keyUpdaterFact, "");
keyUpdater.addSign("SDBF36SDLSI3E4FHXISHK7PNAVYI422BUMHX3TKPLCSD2EA5C3BCHDQO:stellar-priv-v0.0.1");

const transfersItem = generator.createTransfersItem("EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1", generator.createAmounts([{big:100,  cid:"MCC"}]));
const transfersFact = generator.createTransfersFact("BaY4pBBTXeQVeGEUTcKiBEZ4tS1M3F4hys32da81yoi:mca-v0.0.1", [transfersItem]);
const transfers = generator.createOperation(transfersFact, "");
transfers.addSign("SDIW5NNOL6ZYNQK6Q4G5QAWY3ZDT4DZAC5OFU7NRGT6J7SACP72YNAZA:stellar-priv-v0.0.1");

const seal = generator.createSeal("SDBF36SDLSI3E4FHXISHK7PNAVYI422BUMHX3TKPLCSD2EA5C3BCHDQO:stellar-priv-v0.0.1", [transfers]);

const parser = Xseal.JSONParser;
// console.log(parser.toJSONString(seal));
parser.generateFile(seal, './example/seal.json');