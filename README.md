# mitum-js-util

'mitum-js-util' will introduce the usage of [mitum-currency](https://github.com/ProtoconNet/mitum-currency) for Javascript.

## Installation

Recommended requirements for 'mitum-js-util' are,

* node v12.22.1
* npm v6.14.12

and

* bs58 v4.0.1
* bs58check v2.1.2
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

Notice that the package name of 'mitum-js-util' is 'mitumc' for js codes.

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

You must add new fact signature by addSign before creating seal or json files from an operation.

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

Key-Updater literally supports to update source public key to something else.

#### Usage

```js
>>> const mitumc = require('mitumc');
>>> const generator = new mitumc.Generator('mitum');

>>> const sourcePriv = "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1";
>>> const toPub = "04a38bb1568ae40d2a50e7c0d36357a51f4152125a50105a7dd24d517a4e23bfb109342ace92752d21db62bf3839dd482b82b315a86f56454213a8252b0af45d03:ether-pub-v0.0.1";
>>> const fromAddr = "GYJMxzXsgUbhayJvG34HAVT6288EYEkUxdyghDhjibtv:mca-v0.0.1";

>>> const key = generator.formatKey(toPub, 100);
>>> const keys = generator.createKeys([key], 100);

>>> const keyUpdaterFact = generator.createKeyUpdaterFact(fromAddr, "MCC", keys);
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

You can create a json file from generated seal object without 'JSONParser' class provided by 'mitumc'. However, I recommend to use 'JSONParser' for convenience.

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

>>> const operations = [createAccounts, keyUpdater, transfers];
>>> const seal = generator.createSeal(signer, operations);

>>> parser.toJSONString(seal);
>>> parser.generateFile(seal, 'seal.json');
```

Then the result format of generateFile() will be like [this](example/seal.json). (Each value is up to input arguments and time)

## Send Seal to Network

Created seal json files will be used to send seals by 'mitum-currency'.

Use below command to send them to the target network. (See [mitum-currency](https://github.com/ProtoconNet/mitum-currency) for details)

```sh
$ ./mc seal send --network-id=$NETWORK_ID $SIGNING_KEY --seal=seal.json
```

* seal.json is your seal file.

## Sign Message

Sign message with btc, ether, stellar keypair.

'mitumc' supports 'generate' and 'get' keypairs. You can get signature digest which contains a signature by signing with keypairs.

### Usage

#### Generate Keypair

```js
>>> const mitumc = require('mitumc');

>>> const btckp = mitumc.getKeypair('btc'); // returns BTCKeyPair
>>> const ethkp = mitumc.getKeypair('ether'); // returns ETHKeyPair
>>> const stlkp = mitumc.getKeypair('stellar'); // returns StellarKeyPair

>>> btckp.privKey.key
'Kx8iQPN3jiHcyKQDrsMitKqWPfMfoRZY5HtgeTi5z4ka96M4WuzV'

>>> btckp.pubKey
'yX6ZF6hEyUeB982tVGLRwVXkMpXmWFYcUTrbrLrtP82K'

>>> ethkp.privKey.key
'ed2cbba9ca8275589fb34077a71eb644532c3a5da99bc45bf5240860e92ef206'

>>> ethkp.pubKey
'0444d85b17c09878a78faf79dbd556c8dba98fc54b5e731724f748afe157e3fe9b1feb7130734a5f5aef96d9a4c42e1b53946d6e0bb35b133219ce296897ed864e'

>>> stlkp.privkey.key
'SDPOMCTDYBZVVLSXSBDLR6TFGY6C7EPPVJXCSYF7XLH7B3WMY5EWE6A7'

>>> stlkp.pubKey
'GCCLMGH7QKO6NI4OJ42YRLADR6XSVZQEOMRSCB4BROY6PAX4Z3WC264A'
```

Note that 'mitumc.getKeypair()' and 'mitumc.toKeypair()' provides compressed btc key - aka compressed wif.

Of course, you can get any keypair with your known private key by using 'toKeypair'.

Note that it works with either hintless or hinted keys to generate keypairs. (key-hint ex. btc-priv, ether-pub, etc...) 

```js
>>> const mitumc = require('mitumc');

// both work same
>>> const btckp = mitumc.toKeypair("L2ddEkdgYVBkhtdN8HVXLZk5eAcdqXxecd17FDTobVeFfZNPk2ZD:btc-priv-v0.0.1", '');
>>> const btckp2 = mitumc.toKeypair("L2ddEkdgYVBkhtdN8HVXLZk5eAcdqXxecd17FDTobVeFfZNPk2ZD", 'btc'); // returns BTCKeyPair

>>> const ethkp = mitumc.toKeypair("013e56aca7cf88d95aa6535fb6c66f366d449a0380128e0eb656a863b45a5ad5:ether-priv-v0.0.1", ''); // returns ETHKeyPair
>>> const stlkp = mitumc.toKeypair("SBZV72AJVXGARRY6BYXF5IPNQYWMGZJ5YVF6NIENEEATETDF6LGH4CLL:stellar-priv-v0.0.1", ''); // returns StellarKeyPair
```

#### Sign Message

Each keypair supports 'sign' method that generates Buffer format signature by signing Buffer format message.

If you want to get signature for 'mitum-currency', use 'bs58' to encode the signature.

```js
>>> const mitumc = require('mitumc'); 
>>> const bs58 = require('bs58');

>>> const msg = Buffer.from('mitum');

>>> const btckp = mitumc.getKeypair('btc');
>>> const sign = btckp.sign(msg)

>>> sign
<Buffer 30 45 02 21 00 9f 21 a9 5d 98 12 60 20 46 0d 0f 2f 48 ab 88 02 21 21 40 6c f2 24 01 32 87 24 3c 06 a2 a2 da 33 02 20 3b a1 43 c0 a0 c1 6b bf 02 c5 95 ... >

>>> bs58.encode(sign);
'AN1rKvtAFuz64U5jEK6FRpxoiLCiGWAjoX3R6NYPQE3WJfpTj9ye9vAyAV3yaGSeangJE1GK8U2eNLSFo2siKq2Zc2CXXUiVE'
```

Omit ether/stellar keypair sign. (bcz same...)

## Add Fact Signature to Operation

With 'Signer' object in 'mitum-js-util', you can add new fact signature to operation json.

To add signatures, you must prepare 'network id' and 'signing key'.

### Usage

For example, suppose that you already have an implemented operation json file like below.

operation.json
```json
{
    "memo": "",
    "_hint": "mitum-currency-create-accounts-operation-v0.0.1",
    "fact": {
        "_hint": "mitum-currency-create-accounts-operation-fact-v0.0.1",
        "hash": "A8z3Ybc4jTLFpfT7AN7Bo25peRQryeAjyZL3Q6EiUw2Q",
        "token": "MjAyMS0wNi0zMFQwNTowMjo1Ny4xNDha",
        "sender": "EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1",
        "items": [
            {
                "_hint": "mitum-currency-create-accounts-single-amount-v0.0.1",
                "keys": {
                    "_hint": "mitum-currency-keys-v0.0.1",
                    "hash": "6yvRQ8mebL9HkArU5ZfgfNwahfcJF2rRecN5m47hv44r",
                    "keys": [
                        {
                            "_hint": "mitum-currency-key-v0.0.1",
                            "weight": 100,
                            "key": "GBLMKGDYI6WICGZOM5XGMEMZJSQZQQKPYD7TPLFVTSHLGNA3CKU5Z27G:stellar-pub-v0.0.1"
                        }
                    ],
                    "threshold": 100
                },
                "amounts": [
                    {
                        "_hint": "mitum-currency-amount-v0.0.1",
                        "amount": "100",
                        "currency": "MCC"
                    }
                ]
            }
        ]
    },
    "hash": "4ZBBYutmuG7XRMbvxfUDeWvVKxu2qSPukGiBwthQZeb1",
    "fact_signs": [
        {
            "_hint": "base-fact-sign-v0.0.1",
            "signer": "cnMJqt1Q7LXKqFAWprm6FBC7fRbWQeZhrymTavN11PKJ:btc-pub-v0.0.1",
            "signature": "381yXZAhzmRES8bssPkA2Pdy95NP1EDvEnNNwj1btcrdCgMLNRnWVpuqQgGLJwXsW4sjjZB7Ek9W4KmxZBSh1D47m4j93PQm",
            "signed_at": "2021-06-30T05:02:57.212Z"
        }
    ]
}
```

#### Sign Operation

Use 'Signer.signOperation(#operation-file-path)' to add new fact signature to "fact_signs" key.

After adding a fact signature, operation hash is always changed.

```js
>>> const Signer = require('mitumc').Signer;
>>> const signer = new Signer('mitum', "L4qMcVKwQkqrnPPtEhj8idCQyvCN2zyG374i5oftGQfraJEP8iek:btc-priv-v0.0.1");

>>> const newOperation = signer.signOperation('operation.json');
```

After signing, above operation must be like below.(Each value is up to input arguments and time)

```json
{
    "memo": "",
    "_hint": "mitum-currency-create-accounts-operation-v0.0.1",
    "fact": {
        "_hint": "mitum-currency-create-accounts-operation-fact-v0.0.1",
        "hash": "A8z3Ybc4jTLFpfT7AN7Bo25peRQryeAjyZL3Q6EiUw2Q",
        "token": "MjAyMS0wNi0zMFQwNTowMjo1Ny4xNDha",
        "sender": "EbVibuKTyPqRVRcCpMRQdP7wBkr33GW2brSQvZQNJDSn:mca-v0.0.1",
        "items": [
            {
                "_hint": "mitum-currency-create-accounts-single-amount-v0.0.1",
                "keys": {
                    "_hint": "mitum-currency-keys-v0.0.1",
                    "hash": "6yvRQ8mebL9HkArU5ZfgfNwahfcJF2rRecN5m47hv44r",
                    "keys": [
                        {
                            "_hint": "mitum-currency-key-v0.0.1",
                            "weight": 100,
                            "key": "GBLMKGDYI6WICGZOM5XGMEMZJSQZQQKPYD7TPLFVTSHLGNA3CKU5Z27G:stellar-pub-v0.0.1"
                        }
                    ],
                    "threshold": 100
                },
                "amounts": [
                    {
                        "_hint": "mitum-currency-amount-v0.0.1",
                        "amount": "100",
                        "currency": "MCC"
                    }
                ]
            }
        ]
    },
    "fact_signs": [
        {
            "_hint": "base-fact-sign-v0.0.1",
            "signer": "cnMJqt1Q7LXKqFAWprm6FBC7fRbWQeZhrymTavN11PKJ:btc-pub-v0.0.1",
            "signature": "381yXZAhzmRES8bssPkA2Pdy95NP1EDvEnNNwj1btcrdCgMLNRnWVpuqQgGLJwXsW4sjjZB7Ek9W4KmxZBSh1D47m4j93PQm",
            "signed_at": "2021-06-30T05:02:57.212Z"
        },
        {
            "_hint": "base-fact-sign-v0.0.1",
            "signer": "cnMJqt1Q7LXKqFAWprm6FBC7fRbWQeZhrymTavN11PKJ:btc-pub-v0.0.1",
            "signature": "381yXZETg1xjq1dLJPV8ZVBnr8i62mF6Hg3MirYLYRX6bUw1evk2bCf5NaMUkav8G92AjRv6zfTi7zmvEjwW9r7bRwNa5219",
            "signed_at": "2021-07-02T08:13:31.825Z"
        }
    ],
    "hash": "FJCtuUm9v9YMbkER738ZzPpy1iGuTgabnaaxm5R9jHaV"
}
```

Signer class doesn't create json file of new operation.

Use 'JSONParser' if you need.