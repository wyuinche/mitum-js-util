const Xseal = require('../lib/seal');

const generator = new Xseal.Generator("mitum");

const source_priv = "SAZ4AMZV62FTWULIYLAH2PLR6LY7JVWAI4SOIFRHQLMNQ2W4NKMWDPL3:stellar-priv-v0.0.1";
const source_pub = "GCSFDZ63ZGFWHN3M4XNAZKPLKWEEW32BMTM3KSVK4IFY7JCUVNF6GPNH:stellar-pub-v0.0.1";
const source_addr = "6d1pvkKLurRPovsKuQ6X75r7gX5GYHzrWpzpgyyYe6xi:mca-v0.0.1";

const t1_priv = "L3uk75d86TZe6UbtMGQazs8YhpMshuRYFeZx5LgiF9NTD1fjLJcp:btc-priv-v0.0.1";
const t1_pub = "caRF1K6yCpaBh25hCS3czckjTjaRBpjvVsZn3qKWGzPC:btc-pub-v0.0.1";
const t1_addr = "G6mRkczkChCfGEV9qT8h9V3TeUdagxSpbN4KMuC2LtoV:mca-v0.0.1";

const t2_priv = "538ea76542bbf31d1e10fe7aef1e4d8509a604cd425e794689ffed13d80845c5:ether-priv-v0.0.1";
const t2_pub = "0422a860ed96a917c41d95b50d61e0d34fb0f7aa1f0b47dca5dc2ad9b7514497aa94ad8e62f3b1a9e877fee95075b7003f8c432b37eb90f2f01ed1cee4f31879ae:ether-pub-v0.0.1";
const t2_addr = "3mUWvUYfujVgFi3HVMzxKWfcKv7amXHsw3kPnp4w3Eer:mca-v0.0.1";

const t3_priv = "SDYGFIYUY4JI2QAJHCTRRRAZO26F25H3UEQQK3KOHELWHCY3D4ZGK5WS:stellar-priv-v0.0.1";
const t3_pub = "GBOT4UVZPRDYDFZF7NHJQO332IFQU7L6UGUPNJYO2AIBSGDRW32NJZ5A:stellar-pub-v0.0.1";
const t3_addr = "Fvwhx4TvqkhLQJMoUqXWwnR76Gxv7Rcz6ZxaSdYEVUaX:mca-v0.0.1";


// Create Accounts
const key = generator.formatKey(t1_pub, 100); // publickey, weight
const keys = generator.createKeys([key], 100); // [], threshold
const amount = generator.formatAmount(1000000000, "MCC");
const amounts = generator.createAmounts([amount]);
const createAccountsItem = generator.createCreateAccountsItem(keys, amounts);
const createAccountsFact = generator.createCreateAccountsFact(source_addr, [createAccountsItem]);
const createAccounts = generator.createOperation(createAccountsFact, "");
createAccounts.addSign(source_priv);


// Key Updater
const key2 = generator.formatKey(t2_pub, 100);
const keys2 = generator.createKeys([key2], 100);
const keyUpdaterFact = generator.createKeyUpdaterFact(t1_addr, "MCC", keys2);
const keyUpdater = generator.createOperation(keyUpdaterFact, "");
keyUpdater.addSign(source_priv);


// Transfers
const amount2 = generator.formatAmount(100, "MCC");
const transfersItem = generator.createTransfersItem(t1_addr, generator.createAmounts([amount2]));
const transfersFact = generator.createTransfersFact(source_addr, [transfersItem]);
const transfers = generator.createOperation(transfersFact, "");
transfers.addSign(source_priv);


// Seal
const seal = generator.createSeal(t3_priv, [createAccounts]);


// Create JSON Files
const parser = Xseal.JSONParser;
parser.generateFile(createAccounts.dict(), './example/create_accounts.json');
parser.generateFile(keyUpdater.dict(), './example/key_updater.json');
parser.generateFile(transfers.dict(), './example/transfers.json');
parser.generateFile(seal, './example/seal.json');
