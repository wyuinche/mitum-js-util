const Xseal = require('../lib/seal');

const priv= "KwjhuyaWA3ct3hmDyWPNhhfmyt61ZZsEWYVWjBSwEYdJXvRgoeyi:btc-priv-v0.0.1";
const pub = "kQxEqq6t32EEegAvV4oqAGcwQJojertuU7EdsvZYAB9X:btc-pub-v0.0.1";
const addr = "2mFPBWgASRvtuiJ6P9DuVF6f4kmnJxn7p4khjDLXBTmP:mca-v0.0.1";

const generator = new Xseal.Generator('mitum');
const key = generator.formatKey(pub, 100);
const keys = generator.createKeys([key], 100);

const spriv = "SAA7UAG4BYG6PZCPQZ5BPBA5OMOJVH5BIKZQFIZRM6TPFJ5TQW3QAHE3:stellar-priv-v0.0.1";
const spub = "GBMQ2ZIPTVULEH37AZVX3PF2UNHEAHZRNQXWGU2Z53OI3IDDHMK3AA3Y:stellar-pub-v0.0.1";
const saddr = "PGKUST2YyoS1ujCKpXKUgVcn1Vk323cFP3pN5Z2Gf7k:mca-v0.0.1";

const amount = generator.formatAmount(1000, "MCC");
const item = generator.createCreateAccountsItem(keys, [amount]);



const fact = generator.createCreateAccountsFact(saddr, [item]);

console.log("here");

const operation = generator.createOperation(fact, "");

operation.addSign(spriv);
