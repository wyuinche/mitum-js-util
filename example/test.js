const Xseal = require('../lib/seal');

const generator = new Xseal.Generator("mitum");

const source_priv = "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1";
const source_pub = "cnMJqt1Q7LXKqFAWprm6FBC7fRbWQeZhrymTavN11PKJ:btc-pub-v0.0.1";
const source_addr = "EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1";

// const source_priv = "SAA7UAG4BYG6PZCPQZ5BPBA5OMOJVH5BIKZQFIZRM6TPFJ5TQW3QAHE3:stellar-priv-v0.0.1";
// const source_pub = "GBMQ2ZIPTVULEH37AZVX3PF2UNHEAHZRNQXWGU2Z53OI3IDDHMK3AA3Y:stellar-pub-v0.0.1";
// const source_addr = "PGKUST2YyoS1ujCKpXKUgVcn1Vk323cFP3pN5Z2Gf7k:mca-v0.0.1";

const t1_priv = "SB5SXFLLX3J7DB57YIXPIK4HLH2NKNHSHLI7N6COKZZXR2XDT7AAWQH2:stellar-priv-v0.0.1";
const t1_pub = "GBLMKGDYI6WICGZOM5XGMEMZJSQZQQKPYD7TPLFVTSHLGNA3CKU5Z27G:stellar-pub-v0.0.1";
const t1_addr = "6yvRQ8mebL9HkArU5ZfgfNwahfcJF2rRecN5m47hv44r:mca-v0.0.1";

// const t1_priv= "KwjhuyaWA3ct3hmDyWPNhhfmyt61ZZsEWYVWjBSwEYdJXvRgoeyi:btc-priv-v0.0.1";
// const t1_pub = "kQxEqq6t32EEegAvV4oqAGcwQJojertuU7EdsvZYAB9X:btc-pub-v0.0.1";
// const t1_addr = "2mFPBWgASRvtuiJ6P9DuVF6f4kmnJxn7p4khjDLXBTmP:mca-v0.0.1";

// const t2_priv = "2244f57b65ffc3fac621877ebe903c98c3e323d2b7d78fdad2ae5b951658e502:ether-priv-v0.0.1";
// const t2_pub = "04a38bb1568ae40d2a50e7c0d36357a51f4152125a50105a7dd24d517a4e23bfb109342ace92752d21db62bf3839dd482b82b315a86f56454213a8252b0af45d03:ether-pub-v0.0.1";
// const t2_addr = "CYGwn6CM5598PTFMC2GGgiJsJ7Ucuf6Tkw1wL6gqBsyW:mca-v0.0.1";

// const t3_priv = "L4p6NAjJWERn5q4PAepPo6o7VP5qRboXSX1DA5zggJ61uY2vdhf5:btc-priv-v0.0.1";
// const t3_pub = "fD7rnUY4p2YSpsH9kYGnh8Wz21ujRR1qaj8aN1UupUnC:btc-pub-v0.0.1";
// const t3_addr = "Ceo3pcdDaYXM8m8uhv9dFWaycLJk1Y26AutPULXvXAqo:mca-v0.0.1";

const key = generator.formatKey(t1_pub, 100);
const keys = generator.createKeys([key], 100);
const amount = generator.formatAmount(1000000000, "MCC");
const amounts = generator.createAmounts([amount]);
const createAccountsItem = generator.createCreateAccountsItem(keys, amounts);
const createAccountsFact = generator.createCreateAccountsFact(source_addr, [createAccountsItem]);
const createAccounts = generator.createOperation(createAccountsFact, "");
createAccounts.addSign(source_priv);

// const key2 = generator.formatKey(t2_pub, 100);
// const keys2 = generator.createKeys([key2], 100);
// const keyUpdaterFact = generator.createKeyUpdaterFact(t1_addr, "MCC", keys2);
// const keyUpdater = generator.createOperation(keyUpdaterFact, "");
// keyUpdater.addSign(source_priv);

// const amount2 = generator.formatAmount(100, "MCC");
// const transfersItem = generator.createTransfersItem(t1_addr, generator.createAmounts([amount2]));
// const transfersFact = generator.createTransfersFact(source_addr, [transfersItem]);
// const transfers = generator.createOperation(transfersFact, "");
// transfers.addSign(source_priv);

// const seal = generator.createSeal(t3_priv, [createAccounts]);

const parser = Xseal.JSONParser;
parser.generateFile(createAccounts.dict(), './example/create_accounts.json');