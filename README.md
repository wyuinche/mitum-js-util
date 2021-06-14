# mitum-js-util

'mitum-js-util' will introduce the usage of [mitum-currency](https://github.com/ProtoconNet/mitum-currency) for Javascript.

## Installation

Recommended requirements for 'mitum-js-util' are,

* node v10.19.0
* npm v6.14.4

and

* bignum v0.13.1
* bs58 v4.0.1
* bs58check v2.1.2
* crypto v1.0.1
* eccrypto-js v5.4.0
* elliptic v6.5.4
* secp256k1 v4.0.2
* stellar-sdk v4.0.2

```sh
$ node --version
v10.19.0

$ npm --version
6.14.4
```

This package, 'mitum-js-util'(or 'mitumc') hasn't been published by npm yet, so now you must install it as a local package.
Use 'npm link' to install.

Notice: 'mitum-js-util' will be provided as 'mitumc' in node interpreter and js code.

```sh
$ cd mitum-js-util

$ sudo npm install -g
+ mitumc@0.0.1
added 1 package from 1 contributor in 0.384s

$ npm link mitumc
./mitum-js-util/node_modules/mitumc -> /usr/local/lib/node_modules/mitumc -> ./mitum-js-util
```

## Generate New Operation

### Operations

'mitum-js-util' provides three operations to be generated,

* 'Create-Accounts' creates an account corresponding to any public key with a pre-registered account.
* 'Key-Updater' updates the public key of the account to something else.
* 'Transfers' transfers tokens from the account to another account.

'mitum-currency' supports various kinds of operations, but 'mitum-js-util' will provide these frequently used operations.

### Prerequisite

Before generating new operation, you should check below,

* 'private key' of source account to generate signatures (a.k.a signing key)
* 'public address' of source account
* 'public key' of target account
* 'network id'

Notice that the package name of 'mitum-py-util' is 'mitumc' for js codes.

* Every key, address, and keypair must be that of mitum-currency.

### Generator

'mitumc' package provides 'Generator' class to generate operations.

Modules that 'Generator' supports are,

```js
>>> Generator.setNetworkID(netID)
>>> Generator.formatKey(key, weight) 
>>> Generator.formatAmount(big, cid)
>>> Generator.createKeys(keys, threshold)
>>> Generator.createAmounts(amounts) 
>>> Generator.createCreateAccountsItem(keys_o, amounts)
>>> Generator.createTransfersItem(receiver, amounts)
>>> Generator.createCreateAccountsFact(sender, items)
>>> Generator.createKeyUpdaterFact(target, cid, keys_o)
>>> Generator.createTransfersFact(sender, items)
>>> Generator.createOperation(fact, memo)
>>> Generator.createSeal(signKey, operations)

>>> Generator.id
netID
```

You can check use-cases of Generator in the next part.

### Generate Create-Accounts 

For new account, 'currency id' and 'initial amount' must be set. With source account, you can create and register new account of target public key.

When you use 'Generator', you must set 'network id' before you create something.

#### Usage

```js
>>> const mitumc = require('mitumc');
>>> const generator = new mitumc.Generator('mitum');

>>> const sourcePriv = "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1";
>>> const sourceAddr = "EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1";
>>> const targetPub = "GC4HJHQ2IAW4YTH7KLDE6BSC5WRTEPYZ625LPL4FGFUFGKWK2I7YWRYB:stellar-pub-v0.0.1";

>>> const key = generator.formatKey(targetPub, 100);
>>> const keys = generator.createKeys([key], 100);

>>> const amount = generator.formatAmount(100, "MCC");
>>> const amounts = generator.createAmounts([amount]);

>>> const createAccountsItem = generator.createCreateAccountsItem(keys, amounts);
>>> const createAccountsFact = generator.createCreateAccountsFact(sourceAddr, [createAccountsItem]);
>>> const createAccounts = generator.createOperation(createAccountsFact, "");

>>> createAccounts.addSign(sourcePriv);
```

You must add new fact signature by addSign before create seal or json files from an operation.

Then Operation.dict() methods work correctly.

```js
>>> createAccounts.dict();
{ memo: '',
  _hint: 'mitum-currency-create-accounts-operation-v0.0.1',
  fact:
   { _hint: 'mitum-currency-create-accounts-operation-fact-v0.0.1',
     hash: '5wgeuNYFqWqr99ExN1jWK4PTTgH3atcRpqkJ8qSTWKi6',
     token: 'MjAyMS0wNi0xNFQwMzo0OTo1Ny4wMDJa',
     sender: 'EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1',
     items: [ [Object] ] },
  hash: '4wZ6Qc8qk4qc92RsNsVgg13uLcSXuU1WbYaK89yoBjz5',
  fact_signs:
   [ { _hint: 'base-fact-sign-v0.0.1',
       signer:
        'cnMJqt1Q7LXKqFAWprm6FBC7fRbWQeZhrymTavN11PKJ:btc-pub-v0.0.1',
       signature:
        'AN1rKvtkNiWEtLpfpz6T3XQEDQd2JCsUQRdrL4wwy7w3yqrPYFqtbPGR6uBqVLpEVAY2G2nrQZZsn5Ei5ycvvF4QGuTr6ckXE',
       signed_at: '2021-06-14T03:50:16.123Z' } ] }
```

### Generate Key-Updater

Key-Updater literally supports to update cource public key to something else.

#### Usage

```js
>>> const mitumc = require('mitumc');
>>> const generator = new mitumc.Generator('mitum');

>>> const sourcePriv = "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1";
>>> const toPub = "04a38bb1568ae40d2a50e7c0d36357a51f4152125a50105a7dd24d517a4e23bfb109342ace92752d21db62bf3839dd482b82b315a86f56454213a8252b0af45d03:ether-pub-v0.0.1";
>>> const fromAddr = "GYJMxzXsgUbhayJvG34HAVT6288EYEkUxdyghDhjibtv:mca-v0.0.1";

>>> const key = generator.formatKey(toPub, 100);
>>> const keys = generator.createKeys([key], 100)

>>> const keyUpdaterFact = generator.createKeyUpdaterFact(fromAddr, "MCC", keys2);
>>> const keyUpdater = generator.createOperation(keyUpdaterFact, "");

>>> keyUpdater.addSign(source_priv);
```

### Generate Transfers

To generate an operation, you must prepare target address, not public key. Transfers supports to send tokens to another account.

#### Usage

```js
>>> const mitumc = require('mitumc');
>>> const generator = new mitumc.Generator('mitum');

>>> const sourcePriv = "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1";
>>> const targetAddr = "GYJMxzXsgUbhayJvG34HAVT6288EYEkUxdyghDhjibtv:mca-v0.0.1";

>>> const amount = generator.formatAmount(100, "MCC");
>>> const amounts = generator.createAmounts([amount]);

>>> const transfersItem = generator.createTransfersItem(targetAddr, amounts);
>>> const transfersFact = generator.createTransfersFact(sourceAddr, [transfersItem]);
>>> const transfers = generator.createOperation(transfersFact, "");

>>> transfers.addSign(source_priv);
```

## Generate New Seal

Supports you to generate a seal json file such that the seal is able to consist of several operations. Those operations can be any type 'mitum-js-util' provides.

### Prerequisite

To generate a seal, 'mitum-js-util' requires,

* 'signing key'
* 'a list of pre-constructed operations' not empty

Registration of 'signing key' as the private key for an account is not neccessary.

### JSONParser

You can create a json file from generated seal object without 'JSONParser' class provided by 'mitumc'. However, I recommend that use 'JSONParser' for convenience.

Modules that 'JSONParser' supports are,

```js
>>> JSONParser.toJSONString(seal)
>>> JSONParser.generateFile(seal, fName)
```

A use-case of 'JSONParser' will be introduced in the next part.

### Usage

First of all, suppose that every operation is that generated by 'Generator'. (createAccounts, keyUpdater, Transfers)

### Example

```js
>>> const mitumc = require('mitumc');
>>> const generator = new mitumc.Generator('mitumc');
>>> const parser = mitumc.JSONParser;

// ... omitted
// Create each operation [createAccounts, keyUpdater, transfers] with generator.
// See above sections.
// ...

>>> const signer = "L4p6NAjJWERn5q4PAepPo6o7VP5qRboXSX1DA5zggJ61uY2vdhf5:btc-priv-v0.0.1";

>>> operations = [createAccounts, keyUpdater, transfers]
>>> seal = generator.createSeal(signer, operations)

>>> parser.toJSONString(seal)
>>> parser.generateFile(seal, 'seal.json')
```

Then the result format of generateFile() will be like [this](example/seal.json). (Each value is up to input arguments and time)

## Send Seal to Network

Created seal json files will be used to send seals by 'mitum-currency'.

Use below command to send them to the target network. (See [mitum-currency](https://github.com/ProtoconNet/mitum-currency) for details)

```sh
$ ./mc seal send --network-id=$NETWORK_ID $SIGNING_KEY --seal=seal.json
```

* seal.json is your seal file.
