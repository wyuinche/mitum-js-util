# mitum-js-util

'mitum-js-util' will introduce the usage of [mitum-currency](https://github.com/ProtoconNet/mitum-currency) and [mitum-data-blocksign](https://github.com/ProtoconNet/mitum-data-blocksign) for Javascript.

## Installation

Recommended requirements for 'mitum-js-util' are,

* node v16.10.0 or later
* npm v7.24.0 or later

```sh
$ node --version
v16.10.0

$ npm --version
7.24.0
```
Notice: the package name of 'mitum-js-util' is 'mitumc'.

```sh
$ npm install mitumc
added 74 packages, and audited 75 packages in 23s
```

## Index

||Title|
|---|---|
|1|[Generate New Keypairs](#generate-new-keypairs)|
|2|[Generate New Operation](#generate-new-operation)|
|2-1|[Get Address of New Account](#get-address-of-new-account)|
|2-2|[Generate Create-Accounts](#generate-create-accounts)|
|2-3|[Generate Key-Updater](#generate-key-updater)|
|2-4|[Generate Transfers](#generate-transfers)|
|2-5|[Generate Create-Documents](#generate-create-documents)|
|2-6|[Generate Sign-Documents](#generate-sign-documents)|
|2-7|[Generate Transfer-Documents](#generate-transfer-documents)|
|3|[Generate New Seal](#generate-new-seal)|
|4|[Send Seal to Network](#send-seal-to-network)|
|5|[Sign Message](#sign-message)|
|6|[Add Fact Signature to Operation](#add-fact-signature-to-operation)|

<br />

|Class|
|---|
|[Generator](#generator)|
|[JSONParser](#jsonparser)|
|[Signer](#sign-operation)|

<br />

|Appendix|
|---|
|[About Time Stamp](#about-time-stamp)|

## Generate New Keypairs

`mitumc` supports to generate keypairs for mitum-currency.

Note that there are respective type suffix to each private key, public key, and mitum-currency address.

* private key: mpr
* public key: mpu
* address: mca

### Methods 

There is a method to generate keypairs without any seed. `getNewKeypair()`.

First, it creates a btc private key and use its compressed wif as seed for new Keypair.

If you have `seed` for new Keypair, use `getKeypairFromSeed(seed)`.

Also you can import your own private key to Keypair by `getKeypairFromPrivateKey(key)`.

```js
/* Generate new Keypair without seed */
getNewKeypair()

/* Generate new Keypair with seed */
getKeypairFromSeed(seed)

/* Generate Keypair from your private key */
getKeypairFromPrivateKey(key)
```

#### Usage

Without any seed,

```js
import { getNewKeypair } from 'mitumc';

const kp = getNewKeypair(); // returns Keypair

kp.getPrivateKey(); // 'KzF4ia7G8in3hm7TzSr5k7cNtx46BdEFTzVdnh82vAopqxJG8rHompr'
kp.getPublicKey(); // '25jrVNpKr59bYxrWH8eTkbG1iQ8hjvSFKVpfCcDT8oFf8mpu'

kp.getRawPrivateKey(); // KzF4ia7G8in3hm7TzSr5k7cNtx46BdEFTzVdnh82vAopqxJG8rHo
kp.getRawPublicKey(); // 25jrVNpKr59bYxrWH8eTkbG1iQ8hjvSFKVpfCcDT8oFf8mpu
```

From a seed,

```js
import { getKeypairFromSeed } from 'mitumc';

const kp = getKeypairFromSeed("Thelengthofseedshouldbelongerthan36characters.Thisisaseedfortheexample.");

kp.getPrivateKey(); // KynL1wNZjuXvZDboEugU4sWKZ6ck5GTMqtv6eod8Q7C4NaB4kfZPmpr
kp.getPublicKey(); // fyLbH5cUwNTihaW2YkJkAzeoLvTNTzf98r8dtCkjXbuqmpu

kp.getRawPrivateKey(); // KynL1wNZjuXvZDboEugU4sWKZ6ck5GTMqtv6eod8Q7C4NaB4kfZP
kp.getRawPublicKey(); // fyLbH5cUwNTihaW2YkJkAzeoLvTNTzf98r8dtCkjXbuq
```

From your private key,

```js
import { getKeypairFromPrivateKey } from 'mitumc';

const kp = getKeypairFromPrivateKey("Kz5b6UMxnRvgL91UvNMuRoTfUEAUw7htW2z4kV2PEZUCVPFmdbXimpr");

kp.getPrivateKey(); // Kz5b6UMxnRvgL91UvNMuRoTfUEAUw7htW2z4kV2PEZUCVPFmdbXimpr
kp.getPublicKey(); // 239uA6z7MxkZfwp5zYKZ6eBbRWk38AvxeyzfHGQM8o2H8mpu

kp.getRawPrivateKey(); // Kz5b6UMxnRvgL91UvNMuRoTfUEAUw7htW2z4kV2PEZUCVPFmdbXi
kp.getRawPublicKey(); //239uA6z7MxkZfwp5zYKZ6eBbRWk38AvxeyzfHGQM8o2H8
```

## Generate New Operation

### Operations

'mitum-js-util' provides three operations of 'mitum-currency',

* `Create-Accounts` creates an account corresponding to any public key with a pre-registered account.
* `Key-Updater` updates the public key of the account to something else.
* `Transfers` transfers tokens from the account to another account.

'mitum-currency' supports various kinds of operations, but 'mitum-js-util' will provide these frequently used operations.

In addition, 'mitum-js-util' provides three operations of 'mitum-data-blocksign',

* `Create-Documents` creates an document with filehash.
* `Sign-Documents` signs the document.
* `Transfer-Documents` transfers documents from the account to another account.

### Prerequisite

Before generating new operation, you should check below,

* `private key` of source account to generate signatures (a.k.a signing key)
* `public address` of source account
* `public key` of target account
* `network id`

Additionally, you should check below for 'mitum-data-blocksign',

* `filehash` for Create-Documents
* `owner` and `documentid` for Sign-Documents and Transfer-Documents

Notice that the package name of 'mitum-js-util' is `mitumc` for js codes.

* Every key, address, and keypair must be that of mitum-currency.

### Generator

`mitumc` package provides `Generator` class to generate operations.

First of all, set network id of Generator.

```js
>>> const { Generator } = require('mitumc');

>>> const id = 'mitum';

>>> const generator = new Generator(id);
>>> generator.id;
mitum
```

1. For `mitum-currency`, use `Generator.currency`.

```js
Generator.currency.key(key, weight) // 1 <= $weight <= 100
Generator.currency.amount(big, cid) // typeof $big === "string" 
Generator.currency.createKeys(keys, threshold) // 1 <= $threshold <= 100
Generator.currency.createAmounts(amounts) 
Generator.currency.createCreateAccountsItem(keys_o, amounts)
Generator.currency.createTransfersItem(receiver, amounts)
Generator.currency.createCreateAccountsFact(sender, items)
Generator.currency.createKeyUpdaterFact(target, cid, keys_o)
Generator.currency.createTransfersFact(sender, items)
```

2. For `mitum-data-blocksign`, use `Generator.blockSign`.

```js
Generator.blockSign.createCreateDocumentsItem(fileHash, did, signcode, title, size, cid, signers, signcodes)
Generator.blockSign.createSignDocumentsItem(owner, did, cid)
Generator.blockSign.createTransferDocumentsItem(owner, receiver, did, cid)
Generator.blockSign.createBlockSignFact(factType, sender, items)
```

3. To create operation and seal, use `Generator.createOperation(fact, memo)` and `Generator.createSeal(signKey, operations)`.

```js
Generator.createOperation(fact, memo)
Generator.createSeal(signKey, operations)
```

You can check use-cases of `Generator` in the next part.

### Get Address of New Account

First of all, `Keys` object must be made. Use `key` and `createKeys` of Generator.

Note that 1 <= `threshold`, `weight` <= 100.

```js
import { Generator } from 'mitumc';

/*
* 'mitum' is network id. Put your own one.
* You don't have to put right network id if you want just to get address.
*/
const gn = new Generator('mitum').currency;

const pub1 = "21nHZiHxhjwXtXXhPFzMvGyAAdCobmZeCC1bT1yLXAaw2mpu"
const pub2 = "mZKEkm4BnFq6ynq98q4bCEcE4kZhzLSViPbCx8LDBXk2mpu"
const pub3 = "dPBms4cH4t8tiH6uNbq37HrEWwgrrEZqHQwSbvqEBJ85mpu"

const key1 = gn.key(pub1, 30); // public key in the account & weight
const key2 = gn.key(pub2, 30);
const key3 = gn.key(pub3, 40);

const keys = gn.createKeys([key1, key2, key3], 100); // key list & threshold

const address = keys.address; // address of the account as string

address // 5KYgKnSyGHECJngakyzHDBt58xt1FJJiUUkCXnjcFySpmca
```

### Generate Create-Accounts 

For new account, `currency id` and `initial amount` must be set. With source account, you can create and register new account of target public key.

Note that source account must be already registered one.

When you use `Generator`, you must set `network id` before you create something.

#### Usage

```js
import { Generator } from 'mitumc';

const generator = new Generator('mitum'); 
const gn = generator.currency;

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";                      // sender's account address
const targetPub = "caRF1K6yCpaBh25hCS3czckjTjaRBpjvVsZn3qKWGzPCmpu";                   // public key of the account to newly create

const key = gn.key(targetPub, 100);
const keys = gn.createKeys([key], 100);

const amount = gn.amount("100", "MCC");
const amounts = gn.createAmounts([amount]);

const createAccountsItem = gn.createCreateAccountsItem(keys, amounts);
const createAccountsFact = gn.createCreateAccountsFact(sourceAddr, [createAccountsItem]);
const createAccounts = generator.createOperation(createAccountsFact, "");

createAccounts.addSign(sourcePriv);
```

You must add new fact signature by addSign before creating seal or json files from an operation.

Then Operation.dict() methods work correctly.

```js
createAccounts.dict();
{
  memo: '',
  _hint: 'mitum-currency-create-accounts-operation-v0.0.1',
  fact: {
    _hint: 'mitum-currency-create-accounts-operation-fact-v0.0.1',
    hash: 'Bfo2ZfxWysPAY7ZAJL3cJkhNiwnmo6guZMTJWJYTxvA9',
    token: 'MjAyMS0xMi0wOVQwODozODozNy4zNTZa',
    sender: 'CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca',
    items: [ [Object] ]
  },
  hash: 'G5Gb4GFKQZ7Nb6wf19EFHCo9BDn1eRW9BkwNP82x1Aiy',
  fact_signs: [
    {
      _hint: 'base-fact-sign-v0.0.1',
      signer: '28YvsS7h5CwBaX7rN6DbHoh2rtsH1q3Svw5xK3UbLH3a6mpu',
      signature: '381yXZJ7MMvKqxNR1fr2kxLdvp5qfPP1oSYFts9qh554eup795tAZ9haTpHaAh2aHcAw4hmE62Y2fLzLpJDD4wHey1u75Kye',
      signed_at: '2021-12-09T08:38:37.387Z'
    }
  ]
}
```

### Generate Key-Updater

`Key-Updater` literally supports to update source public key to something else.

#### Usage

```js
import { Generator } from 'mitumc';

const generator = new Generator('mitum');
const gn = generator.currency;

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const toPub = "fNRMg9HNguo1zDtA9E526BGD1yxnBn8zmFE2WXJXqtn9mpu";
const fromAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const key = gn.key(toPub, 100);
const keys = gn.createKeys([key], 100);

const keyUpdaterFact = gn.createKeyUpdaterFact(fromAddr, "MCC", keys);
const keyUpdater = generator.createOperation(keyUpdaterFact, "");

keyUpdater.addSign(sourcePriv);
```

### Generate Transfers

To generate an operation, you must prepare `target address`, not public key. `Transfers` supports to send tokens to another account.

#### Usage

```js
import { Generator } from 'mitumc';

const generator = new Generator('mitum'); // new mitumc.Generator({networkId})
const gn = generator.currency;

const sourcePriv = "KzdeJMr8e2fbquuZwr9SEd9e1ZWGmZEj96NuAwHnz7jnfJ7FqHQBmpr";
const sourceAddr = "2D5vAb2X3Rs6ZKPjVsK6UHcnGxGfUuXDR1ED1hcvUHqsmca";
const targetAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const amount = gn.amount("100", "MCC");
const amounts = gn.createAmounts([amount]);

const transfersItem = gn.createTransfersItem(targetAddr, amounts);
const transfersFact = gn.createTransfersFact(sourceAddr, [transfersItem]);
const transfers = generator.createOperation(transfersFact, "");

transfers.addSign(sourcePriv);
```

### Generate Create-Documents

To generate an operation, you must prepare `file-hash`. `Create-Document` supports to create documents with setting `signers` who must sign them.

#### Usage

```js
import { Generator, BlockSignType } from 'mitumc';

const generator = new Generator('mitum');
const gn = generator.blockSign; // new mitumc.Generator({networkId})

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr";
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";
const signer = "D5VZn3emFTmd1dyVNGEEHoYXtSPxD9d9psy881jpwGbemca";

const createDocumentsItem = gn.createCreateDocumentsItem("abcdabc~mbfh-v0.0.1", 150, "user01", "title150", 1234, "MCC", [signer], ["user02"]);

const createDocumentsFact = gn.createBlockSignFact(BlockSignType.BLOCKSIGN_CREATE_DOCUMENTS, sourceAddr, [createDocumentsItem])

const createDocuments = generator.createOperation(createDocumentsFact, "");

createDocuments.addSign(sourcePriv);
```

### Generate Sign-Documents

To generate an operation, you must prepare `owner` and `document id`. `Sign-Document` supports to sign documents registered by 'mitum-data-blocksign'

#### Usage

```js
import { Generator, BlockSignType } from 'mitumc';

const generator = new Generator('mitum'); // new mitumc.Generator({networkId})
const gn = generator.blockSign;

const owner = "D5VZn3emFTmd1dyVNGEEHoYXtSPxD9d9psy881jpwGbemca";

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr";
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const signDocumentsItem = gn.createSignDocumentsItem(owner, 1, "MCC");

const signDocumentsFact = gn.createBlockSignFact(BlockSignType.BLOCKSIGN_SIGN_DOCUMENTS, sourceAddr, [signDocumentsItem]);

const signDocuments = generator.createOperation(signDocumentsFact, "");

SignDocuments.addSign(sourcePriv);
```

### ~~Generate Transfer-Documents~~

<u>This operation is not supported anymore.</u>

~~To generate an operation, you must prepare `owner` and `document id`. `Transfer-Document` supports to transfer documents to other account.~~

#### Usage

```js
import { Generator, blockSignType } from 'mitumc';

const generator = new Generator('mitum'); // new mitumc.Generator({networkId})
const gn = blockSign.blockSign;

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr";
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";
const targetAddr = "D5VZn3emFTmd1dyVNGEEHoYXtSPxD9d9psy881jpwGbemca";

const transferDocumentsItem = gn.createTransferDocumentsItem(sourceAddr, targetAddr, 1, "MCC");

const transferDocumentsFact = gn.createBlockSignFact(BlockSignType.BLOCKSIGN_TRANSFER_DOCUMENTS, sourceAddr, [transferDocumentsItem]);

const transferDocuments = generator.createOperation(transferDocumentsFact, "");

transferDocuments.addSign(sourcePriv);
```

## Generate New Seal

Supports you to generate a seal json file such that the seal is able to consist of several operations. Those operations can be any type 'mitum-js-util' provides.

### Prerequisite

To generate a seal, 'mitum-js-util' requires,

* `signing key`
* `a list of pre-constructed operations` not empty

Registration of `signing key` as the private key for an account is not neccessary.

### JSONParser

You can create a json file from generated seal object without `JSONParser` class provided by `mitumc`. However, I recommend to use `JSONParser` for convenience.

Modules that `JSONParser` supports are,

```js
JSONParser.toJSONString(seal)
JSONParser.generateFile(seal, fName)
```

A use-case of `JSONParser` will be introduced in the next part.

### Usage

First of all, suppose that every operation is that generated by `Generator`. (createAccounts, keyUpdater, Transfers, etc...)

### Example

```js
import { Generator, JSONParser } from 'mitumc';

const generator = new Generator('mitum'); // new mitumc.Generator({networkId})

// ... omitted
// Create each operation with generator.
// See above sections.
// ...

const signer = "KyK7aMWCbMtCJcneyBZXGG6Dpy2jLRYfx3qp7kxXJjLFnppRYt7wmpr";

const operations = [createAccounts];
const seal = generator.createSeal(signer, operations);

JSONParser.toJSONString(seal);
JSONParser.generateFile(seal, 'seal.json');
```

Then the result format of `generateFile()` will be like [this](example/seal.json). (Each value is up to input arguments and time)

If you would like to create json file of an operation(not seal), use `JSONParser.generateFile(Operation.dict(), 'filename.json')`.

Don't use Operation class to generateFile directly. You must transform Operation instance to dictionary variable by `Operation.dict()` before use `generateFile()`.

## Send Seal to Network

Created seal json files will be used to send seals by 'mitum-currency'.

Use below command to send them to the target network. (See [mitum-currency](https://github.com/ProtoconNet/mitum-currency) for details)

```sh
$ ./mc seal send --network-id=$NETWORK_ID $SIGNING_KEY --seal=seal.json
```

* seal.json is your seal file.

## Sign Message

Sign message with Keypair.

`mitumc` supports 'generate' and 'get' keypairs. You can get signature digest which contains a signature by signing with keypairs.

### Usage

#### Sign String/Bytes

Each keypair supports `sign` method that generates Buffer format signature by signing Buffer format message.

If you want to get signature for 'mitum-currency', use `bs58` to encode the signature.

```js
import { getNewKeypair } from 'mitumc';
import bs58 from 'bs58';

const msg = Buffer.from('mitum');

const kp = getNewKeypair();
const sign = kp.sign(msg); // <Buffer 30 44 02 20 10 59 3d a8 e5 52 5b 46 1e da 16 a2 2b d7 55 77 6a 69 b7 44 12 9d a7 8a 49 45 4d 6a 2f f8 97 aa 02 20 01 10 50 7f 14 a8 9d 28 fd bd 5a 28 ... 20 more bytes>

bs58.encode(sign); // '381yXYmfPnG4vefuMCQNhZzQzBbscttUvhuxUr4y62EvWCWUwtMXoUgVZGysA2jSEtPKBJevtD4nrsePdiQKdGjwrzqgJSev'
```

## Add Fact Signature to Operation

With `Signer` object in 'mitum-js-util', you can add new fact signature to operation json.

To add signatures, you must prepare `network id` and `signing key`.

### Usage

For example, suppose that you already have an implemented operation json file like below.

operation.json
```json
{
    "memo": "",
    "_hint": "mitum-currency-create-accounts-operation-v0.0.1",
    "fact": {
        "_hint": "mitum-currency-create-accounts-operation-fact-v0.0.1",
        "hash": "Bstm7B9pEoygjyMoLmxXTnu5d4TBzpcXaoAvx5m1dZis",
        "token": "MjAyMS0xMi0wOVQwOToxMjo1Ni4xMzha",
        "sender": "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca",
        "items": [
            {
                "_hint": "mitum-currency-create-accounts-single-amount-v0.0.1",
                "keys": {
                    "_hint": "mitum-currency-keys-v0.0.1",
                    "hash": "HVoJASiqZYuqVQnAnW9mRWqeoXfo7dSbAu55orBYqXms",
                    "keys": [
                        {
                            "_hint": "mitum-currency-key-v0.0.1",
                            "weight": 100,
                            "key": "caRF1K6yCpaBh25hCS3czckjTjaRBpjvVsZn3qKWGzPCmpu"
                        }
                    ],
                    "threshold": 100
                },
                "amounts": [
                    {
                        "_hint": "mitum-currency-amount-v0.0.1",
                        "amount": "1000",
                        "currency": "CWC"
                    }
                ]
            }
        ]
    },
    "hash": "9jGDguaPeH8EtPm9X6tBs5QPLCb5mzpH8J51kyUNoRYL",
    "fact_signs": [
        {
            "_hint": "base-fact-sign-v0.0.1",
            "signer": "28YvsS7h5CwBaX7rN6DbHoh2rtsH1q3Svw5xK3UbLH3a6mpu",
            "signature": "381yXZT85ERKm4RsriM6zzNwsgtsj9qD1cUkpygNVGpfSKyY8ZtQkEX634a617VxQwUqFskERPWA93DZwpASqvcSdJUoKB7K",
            "signed_at": "2021-12-09T09:12:56.168Z"
        }
    ]
}
```

#### Sign Operation

Use `Signer.signOperation(operation-file-path)` to add new fact signature to "fact_signs" key.

After adding a fact signature, operation hash is always changed.

```js
import { Signer, JSONParser } from 'mitumc';

const signer = new Signer('mitum', "L3CQHoKPJnK61LZhvvvfRouvAjVVabx2RQXHHhPHbBssgcewjgNimpr");

/* Signer.signOperation(#target) */
/* #target must be a dictionary style object or the path of opertaion json file */
const newOperation = signer.signOperation('operation.json'); // or an object itself instead of the path 'operation.json'

JSONParser.generateFile(newOperation, 'signed.json');
```

After signing, above operation must be like below.(Each value is up to input arguments and time)

```json
{
    "memo": "",
    "_hint": "mitum-currency-create-accounts-operation-v0.0.1",
    "fact": {
        "_hint": "mitum-currency-create-accounts-operation-fact-v0.0.1",
        "hash": "Bstm7B9pEoygjyMoLmxXTnu5d4TBzpcXaoAvx5m1dZis",
        "token": "MjAyMS0xMi0wOVQwOToxMjo1Ni4xMzha",
        "sender": "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca",
        "items": [
            {
                "_hint": "mitum-currency-create-accounts-single-amount-v0.0.1",
                "keys": {
                    "_hint": "mitum-currency-keys-v0.0.1",
                    "hash": "HVoJASiqZYuqVQnAnW9mRWqeoXfo7dSbAu55orBYqXms",
                    "keys": [
                        {
                            "_hint": "mitum-currency-key-v0.0.1",
                            "weight": 100,
                            "key": "caRF1K6yCpaBh25hCS3czckjTjaRBpjvVsZn3qKWGzPCmpu"
                        }
                    ],
                    "threshold": 100
                },
                "amounts": [
                    {
                        "_hint": "mitum-currency-amount-v0.0.1",
                        "amount": "1000",
                        "currency": "CWC"
                    }
                ]
            }
        ]
    },
    "fact_signs": [
        {
            "_hint": "base-fact-sign-v0.0.1",
            "signer": "28YvsS7h5CwBaX7rN6DbHoh2rtsH1q3Svw5xK3UbLH3a6mpu",
            "signature": "381yXZT85ERKm4RsriM6zzNwsgtsj9qD1cUkpygNVGpfSKyY8ZtQkEX634a617VxQwUqFskERPWA93DZwpASqvcSdJUoKB7K",
            "signed_at": "2021-12-09T09:12:56.168Z"
        },
        {
            "_hint": "base-fact-sign-v0.0.1",
            "signer": "nCmzut2QSi3WethMjJBW91xaRn7pPrcq2CTDNb6wLL1rmpu",
            "signature": "381yXZ4uxpwfF9PSQskYXsDwrJqZRsowsnktRQas8WoWf2EZMK6ZPh9ZjCcMLxQSruJ8Gsrvxbtvhud5cZtqyiPmA1LVAXxa",
            "signed_at": "2021-12-09T09:13:19.920Z"
        }
    ],
    "hash": "7gVEAhs9vwb6YKFANGcTo5SJGRHDthLvU81UfS7W7ZPG"
}
```

Signer class doesn't create json file of new operation.

Use `JSONParser` if you need.

## Appendix

### __About Time Stamp__

#### __Expression of Time Stamp__

For blocks, seals, signatures and etc, mitum uses `yyyy-MM-dd HH:mm:ss.* +0000 UTC` expression and `yyyy-MM-ddTHH:mm:ss.*Z` as standard.

All other timezones are not allowed! You must use only +0000 timezone for mitum.

For example,

1. When converting timestamp to byte format for generating block/seal/fact_sign hash
    - converting the string `2021-11-16 01:53:30.518 +0000 UTC` to bytes format

2. When putting timestamp in block, seal, fact_sign or etc
    - converting the timestamp to `2021-11-16T01:53:30.518Z` and put it in json

To generate operation hash, mitum concatenates byte arrays of network id, fact hash and byte arrays of fact_signs.

And to generate the byte array of a fact_sign, mitum concatenates byte arrays of signer, signature digest and signed_at.

Be careful that the format of `signed_at` when converted to bytes is like `yyyy-MM-dd HH:mm:ss.* +0000 UTC` but it will be expressed as `yyyy-MM-ddTHH:mm:ss.*Z` when putted in json.

#### __How many decimal places to be expressed?__

There is one more thing to note.

First at all, you don't have to care about decimal points of second(ss.*) in timestamp.

Moreover, you can write timestamp without `.` and any number under `.`.

However, you should not put any unnecessary zeros(0) in the float expression of second(ss.*) when converting timestamp to bytes format.

For example,

1. `2021-11-16T01:53:30.518Z` is converted to `2021-11-16 01:53:30.518 +0000 UTC` without any change of the time itself.

2. `2021-11-16T01:53:30.510Z` must be converted to `2021-11-16 01:53:30.51 +0000 UTC` when generating hash.

3. `2021-11-16T01:53:30.000Z` must be converted to `2021-11-16T01:53:30 +0000 UTC` when generating hash.

Any timestamp with some unnecessary zeros putted in json doesn't affect to effectiveness of the block, seal, or operation. Just pay attention when convert the format.