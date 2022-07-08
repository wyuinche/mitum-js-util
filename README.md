# mitum-js-util

'matum-js-util' is a JavaScript tool that can create jobs for the models below.

* [mitum-currency](https://github.com/ProtoconNet/mitum-currency)
* [mitum-currency-extension](https://github.com/ProtoconNet/mitum-currency-extension)
* [mitum-document](https://github.com/ProtoconNet/mitum-document)
* [mitum-feefi](https://github.com/ProtoconNet/mitum-feefi).
* [mitum-nft](https://github.com/ProtoconNet/mitum-nft).

All addresses and keys are examples only. Never mind each value in the example.

Use the exact address and key that you can trust when using it. Do not trust all values in this document example.

__With regard to the values given in all examples of this document, we are not responsible for the use of incorrect values.__

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
Note the package name of 'mitum-js-util' is 'mitumc'.

```sh
$ npm install mitumc
```

Note that the latest version of `mitumc` is `v2.0.0-beta2`.

All versions before `v1.0.0` are trial.

## Index

||Title|
|---|---|
|1|[Generate New Keypairs](#generate-new-keypairs)|
|2|[How to Use Generator](#how-to-use-generator)|
|2-1|[Get Address of New Account](#get-address-of-new-account)|
|3|[Generate Currency Operation](#generate-currency-operation)|
|3-1|[Generate Create-Accounts](#generate-create-accounts)|
|3-2|[Generate Key-Updater](#generate-key-updater)|
|3-3|[Generate Transfers](#generate-transfers)|
|3-4|[Generate Create-Contract-Accounts](#generate-create-contract-accounts)|
|3-5|[Generate Withdraws](#generate-withdraws)|
|4|[Generate Document Operation](#generate-document-operation)|
|4-1|[Generate BlockSign Documents](#generate-blocksign-documents)|
|4-2|[Generate BlockCity Documents](#generate-blockcity-documents)|
|4-3|[Generate Create-Documents](#generate-create-documents)|
|4-4|[Generate Update-Documents](#generate-update-documents)|
|4-5|[Generate BlockSign Sign-Documents](#generate-blocksign-sign-documents)|
|5|[Generate FeeFi Operation](#generate-feefi-operation)|
|5-1|[Generate Pool-Register](#generate-pool-register)|
|5-2|[Generate Pool-Policy-Updater](#generate-pool-policy-updater)|
|5-3|[Generate Pool-Deposits](#generate-pool-deposits)|
|5-4|[Generate Pool-Withdraw](#generate-pool-withdraw)|
|6|[Generate NFT Operation](#generate-nft-operation)|
|6-1|[Generate Collection-Register](#generate-collection-register)|
|6-2|[Generate NFT Mint](#generate-nft-mint)|
|6-3|[Generate NFT Transfer](#generate-nft-transfer)|
|6-4|[Generate NFT Burn](#generate-nft-burn)|
|6-5|[Generate Approve](#generate-approve)|
|6-6|[Generate Delegate](#generate-delegate)|
|6-7|[Generate NFT Sign](#generate-nft-sign)|
|7|[Generate New Seal](#generate-new-seal)|
|8|[Send Seal to Network](#send-seal-to-network)|
|9|[Sign Message](#sign-message)|
|10|[Add Fact Signature to Operation](#add-fact-signature-to-operation)|

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
|[License](#license)|

## Generate New Keypairs

`mitumc` supports keypair generation for mitum.

Each private key, public key, and mitum-currency address has its own suffix.

* private key: mpr
* public key: mpu
* address: mca

### Methods 

There is a way to generate keypairs without a seed. `getNewKeypair()`.

If you have `seed` for a new keypair, use `getKeypairFromSeed(seed)`.

Also, `getKeypairFromPrivateKey(key)` allows you to import your private key into `Keypair`.

```js
/* Generate Keypair without a seed */
getNewKeypair()

/* Generate Keypair with your seed */
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
kp.getRawPublicKey(); // 25jrVNpKr59bYxrWH8eTkbG1iQ8hjvSFKVpfCcDT8oFf8
```

With your seed,

```js
import { getKeypairFromSeed } from 'mitumc';

const kp = getKeypairFromSeed("Thelengthofseedshouldbelongerthan36characters.Thisisaseedfortheexample.");

kp.getPrivateKey(); // KynL1wNZjuXvZDboEugU4sWKZ6ck5GTMqtv6eod8Q7C4NaB4kfZPmpr
kp.getPublicKey(); // fyLbH5cUwNTihaW2YkJkAzeoLvTNTzf98r8dtCkjXbuqmpu

kp.getRawPrivateKey(); // KynL1wNZjuXvZDboEugU4sWKZ6ck5GTMqtv6eod8Q7C4NaB4kfZP
kp.getRawPublicKey(); // fyLbH5cUwNTihaW2YkJkAzeoLvTNTzf98r8dtCkjXbuq
```

With your private key,

```js
import { getKeypairFromPrivateKey } from 'mitumc';

const kp = getKeypairFromPrivateKey("Kz5b6UMxnRvgL91UvNMuRoTfUEAUw7htW2z4kV2PEZUCVPFmdbXimpr");

kp.getPrivateKey(); // Kz5b6UMxnRvgL91UvNMuRoTfUEAUw7htW2z4kV2PEZUCVPFmdbXimpr
kp.getPublicKey(); // 239uA6z7MxkZfwp5zYKZ6eBbRWk38AvxeyzfHGQM8o2H8mpu

kp.getRawPrivateKey(); // Kz5b6UMxnRvgL91UvNMuRoTfUEAUw7htW2z4kV2PEZUCVPFmdbXi
kp.getRawPublicKey(); //239uA6z7MxkZfwp5zYKZ6eBbRWk38AvxeyzfHGQM8o2H8
```

## How to Use Generator

This section describes how to use `Generator`. 

### Support Operations

'mitum-js-util' provides three operations of 'mitum-currency'.

* `Create-Accounts` uses pre-registered accounts to create accounts from public keys.
* `Key-Updater` replaces the public key of the account.
* `Transfers` transfers tokens from one account to another.

There are many different types of operations for 'mitum-currency', but 'mitum-js-util' provides only three of these frequently used operations.

'mitum-js-util' provides two operations of 'mitum-currency-extension'.

* `Create-Contract-Accounts` creates a contract account.
* `Withdraws` withdraws tokens from the contract account.

In addition, 'mitum-js-util' provides two operations of 'mitum-document'.

* `Create-Documents` creates an document.
* `Update-Documents` updates the state of the document.

And currently, this sdk supports two models: `blocksign` and `blockcity` implemented based on 'mitum-document'.

'mitum blocksign' provides an additional operation called , `Sign-Documents`.

The following types of documents are available for each model:

* `blocksign` for 'blocksign'.
* `user`, `land`, `vote`, and `history` for 'blockcity'.

'mitum-js-util' provides four operations of 'mitum-feefi'.

* `Pool-Register` registers 'pool' in the contract account.
* `Pool-Policy-Updater` updates 'policy' of the pool in the contract account.
* `Pool-Deposits` deposits amounts in the pool.
* `Pool-Withdraw` withdraws amounts from the pool.

Finally, 'mitum-js-util' provides seven operations of 'mitum-nft'.

* `Collection-Register` registers 'collection' in the contract account.
* `NFT Mint` registers a new nft in 'collection'.
* `NFT Transfer` changes ownership of nft.
* `NFT Burn` burns nft.
* `Approve` delegates the authority to change ownership of a specific nft to a general account.
* `Delegate` delegates the authority to change ownership of all nfts owned by some general account for a specific 'collection'.
* Through `NFT Sign`, you can sign nft as a creator or copyrighter.

### Generator

`mitumc` package provides `Generator` class to help you create operations.

First, set `network id` of `Generator`.

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
Generator.currency.amount(currencyId, amount) // typeof $amount === "string" 
Generator.currency.keys(keys, threshold) // 1 <= $threshold <= 100
Generator.currency.amounts(amounts) 
Generator.currency.getCreateAccountsItem(keys, amounts)
Generator.currency.getTransfersItem(receiver, amounts)
Generator.currency.getCreateAccountsFact(sender, items)
Generator.currency.getKeyUpdaterFact(target, currencyId, keys)
Generator.currency.getTransfersFact(sender, items)

Generator.currency.extension.getCreateContractAccountsItem(keys, amounts)
Generator.currency.extension.getWithdrawsItem(target, amounts)
Generator.currency.extension.getCreateContractAccountsFact(sender, items)
Generator.currency.extension.getWithdrawsFact(sender, items)
```

2. For `mitum-document`, use `Generator.document`.

```js
Generator.document.getCreateDocumentsItem(document, currencyId)
Generator.document.getUpdateDocumentsItem(document, currencyId)
Generator.document.getCreateDocumentsFact(sender, items)
Generator.document.getUpdateDocumentsFact(sender, items)
```

`create-documents` and `update-documents` of 'mitum-document' are common operations of `blocksign` and `blockcity`.

Thus, `document` helps to generate both the `item` and `fact` of these operations simultaneously.

3. Use `Generator.document.blocksign` to create `blocksign` specific objects.

```js
Generator.document.blocksign.user(address, signcode, signed)
Generator.document.blocksign.document(documentId, owner, fileHash, creator, title, size, signers)
Generator.document.blocksign.getSignDocumentsItem(documentId, owner, currencyId)
Generator.document.blocksign.getSignDocumentsFact(sender, items)
```

`sign-documents` is provided only for `blocksign`.

Therefore, it is `Generator.document.blocksign` rather than `Generator.documents` that supports `sign-documents`

The output object of `user` is served as a `creator` or `signer` of `document`. 

4.  Use `Generator.document.blockcity` too create `blockcity` specific objects.

```js
Generator.document.blockcity.candidate(address, nickname, manifest, count)
Generator.document.blockcity.userStatistics(hp, strength, agility, dexterity, charisma intelligence, vital)

Generator.document.blockcity.userDocument(documentId, owner, gold, bankGold, userStatistics)
Generator.document.blockcity.landDocument(documentId, owner, address, area, renter, account, rentDate, period)
Generator.document.blockcity.voteDocument(documentId, owner, round, endTime, candidates, bossName, account, office)
Generator.document.blockcity.historyDocument(documentId, owner, name, account, date, usage, application)
```
5. For `mitum-feefi`, use `Generator.feefi`.

```js
Generator.feefi.getPoolRegisterFact(sender, target, initFee, incomeCid, outgoCid, currencyId)
Generator.feefi.getPoolPolicyUpdaterFact(sender, target, fee, poolId, currencyId)
Generator.feefi.getPoolDepositsFact(sender, pool, poolId, amount)
Generator.feefi.getPoolWithdrawFact(sender, pool, poolId, amounts)
```

6. For `mitum-nft`, use `Generator.nft`.

```js
Generator.nft.signer(account, share, signed)
Generator.nft.signers(total, signers)
Generator.nft.collectionRegisterForm(target, symbol, name, royalty, uri)
Generator.nft.mintForm(hash, uri, creators, copyrighters)
Generator.nft.getMintItem(collection, form, currencyId)
Generator.nft.getTransferItem(receiver, nftId, currencyId)
Generator.nft.getBurnItem(nftId, currencyId)
Generator.nft.getApproveItem(approved, nftId, currencyId)
Generator.nft.getDelegateItem(collection, agent, mode, currencyId)
Generator.nft.getSignItem(qualification, nftId, cid)
Generator.nft.getCollectionRegisterFact(sender, form, currencyId)
Generator.nft.getMintFact(sender, items)
Generator.nft.getTransferFact(sender, items)
Generator.nft.getBurnFact(sender, items)
Generator.nft.getApproveFact(sender, items)
Generator.nft.getDelegateFact(sender, items)
Generator.nft.getSignFact(sender, items)
```

7. To create operations and seals, use `Generator.getOperation(fact, memo)` and `Generator.getSeal(signKey, operations)`.

```js
Generator.getOperation(fact, memo)
Generator.getSeal(signKey, operations)
```

Use cases of `Generator` can be found in the next chapter.

### Get Address of New Account

First, you have to create `Keys`. Use `key` and `keys` of `Generator`.

Note that `1 <= threshold, weight <= 100`.

```js
import { Generator } from 'mitumc';

/*
* 'mitum' is network id. Put yours in.
* You do not need to enter the network ID correctly to obtain the address only.
*/
const gn = new Generator('mitum');

const pub1 = "21nHZiHxhjwXtXXhPFzMvGyAAdCobmZeCC1bT1yLXAaw2mpu"
const pub2 = "mZKEkm4BnFq6ynq98q4bCEcE4kZhzLSViPbCx8LDBXk2mpu"
const pub3 = "dPBms4cH4t8tiH6uNbq37HrEWwgrrEZqHQwSbvqEBJ85mpu"

const key1 = gn.currency.key(pub1, 30); // public key, weight
const key2 = gn.currency.key(pub2, 30);
const key3 = gn.currency.key(pub3, 40);

const keys = gn.currency.keys([key1, key2, key3], 100); // key list, threshold

const address = keys.address; // string address

address // 5KYgKnSyGHECJngakyzHDBt58xt1FJJiUUkCXnjcFySpmca
```

## Generate Currency Operation

This part shows how to create an operation for the currency model.

### Generate Create-Accounts 

For a new account, you must set `current id` and `initial amount`. You can use pre-registered(source) accounts to create and register new accounts from the target public keys.

When using `Generator`, you must set `network id` before using it.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetPub = "caRF1K6yCpaBh25hCS3czckjTjaRBpjvVsZn3qKWGzPCmpu"; // target public keys

const key = gn.currency.key(targetPub, 100);
const keys = gn.currency.keys([key], 100);

const amount = gn.currency.amount("MCC", "100");
const amounts = gn.currency.amounts([amount]);

const createAccountsItem = gn.currency.getCreateAccountsItem(keys, amounts);
const createAccountsFact = gn.currency.getCreateAccountsFact(sourceAddr, [createAccountsItem]);
const createAccounts = gn.getOperation(createAccountsFact, "");
createAccounts.addSign(sourcePriv);
```

You must add a new fact signature via `Opeation.addSign(priv)` before creating a seal or json file from the operation.

Then `Operation.dict()` method works correctly.

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

`Key-Updater` literally supports updating public keys to something else.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const toPub = "fNRMg9HNguo1zDtA9E526BGD1yxnBn8zmFE2WXJXqtn9mpu";
const fromAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const key = gn.currency.key(toPub, 100);
const keys = gn.currency.keys([key], 100);

const keyUpdaterFact = gn.currency.getKeyUpdaterFact(fromAddr, "MCC", keys);
const keyUpdater = gn.getOperation(keyUpdaterFact, "");
keyUpdater.addSign(sourcePriv);
```

### Generate Transfers

To generate an operation, you must prepare a `destination(target) address` rather than public keys. Transfers supports sending tokens to other accounts.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum'); // new mitumc.Generator({networkId})

const sourcePriv = "KzdeJMr8e2fbquuZwr9SEd9e1ZWGmZEj96NuAwHnz7jnfJ7FqHQBmpr";
const sourceAddr = "2D5vAb2X3Rs6ZKPjVsK6UHcnGxGfUuXDR1ED1hcvUHqsmca";
const targetAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const amount = gn.currency.amount("100", "MCC");
const amounts = gn.currency.amounts([amount]);

const transfersItem = gn.currency.getTransfersItem(targetAddr, amounts);
const transfersFact = gn.currency.getTransfersFact(sourceAddr, [transfersItem]);
const transfers = gn.getOperation(transfersFact, "");
transfers.addSign(sourcePriv);
```

### Generate Create-Contract-Accounts

For a new contract account, you need to set `current id` and `initial amount`. You can use a pre-registered account to create and register new contract accounts from the target public keys.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetPub = "caRF1K6yCpaBh25hCS3czckjTjaRBpjvVsZn3qKWGzPCmpu"; // target public keys

const key = gn.currency.key(targetPub, 100);
const keys = gn.currency.keys([key], 100);

const amount = gn.currency.amount("MCC", "100");
const amounts = gn.currency.amounts([amount]);

const createContractAccountsItem = gn.currency.extension.getCreateContractAccountsItem(keys, amounts);
const createContractAccountsFact = gn.currency.extension.getCreateContractAccountsFact(sourceAddr, [createAccountsItem]);
const createContractAccounts = gn.getOperation(createContractAccountsFact, "");
createContractAccounts.addSign(sourcePriv);
```

### Generate Withdraws

`Withdraws` is an operation for withdrawing tokens from a contract account.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const sourcePriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const sourceAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "2D5vAb2X3Rs6ZKPjVsK6UHcnGxGfUuXDR1ED1hcvUHqsmca"; // target contract account's address

const amount = gn.currency.amount("MCC", "100");
const amounts = gn.currency.amounts([amount]);

const withdrawsItem = gn.currency.extension.getWithdrawsItem(targetAddr,  amounts);
const withdrawsFact = gn.currency.extension.getWithdrawsFact(senderAddr, [withdrawsItem])
const withdraws = gn.getOperation(withdrawsFact, "")
withdraws.addSign(senderPriv)
```

## Generate Document Operation

To create or update documents, you must prepare available document objects for each type of operation item.

For example, 'blocksign' supports blocksign document, a type of 'document' with the hint `mitum-blocksign-document-data`.

However, 'blockcity' supports four types of 'document', including user/land/vote/history documents, and their hints are different from blocksign.

That is, you must create a document that corresponds to the type of document you want.

So let's start with how to create documents for each type.

### Generate BlockSign Documents

As mentioned earlier, 'blocksign' uses only one document type, blocksign document.

You must first prepare `creator` and `signer`.

For your convenience, call each `user`.

A `user` can be created by `Generator.document.blocksign.user(address, signCode, signed)`

To create a document, you need to prepare:

* document id
* owner
* file hash
* creator - from `user`
* title
* file size
* a signer list - signers from `user`

All 'blocksign' document IDs are followed by the suffix `sdi`.

#### Usage

```js
import { Generator } from 'mitumc';

const id = 'mitum';
const gn = new Generator(id);

const owner = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";
const signer1 = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";
const signer2 = "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca";

const creator = gn.document.blocksign.user(owner, "signcode00", true)
const user1 = gn.document.blocksign.user(signer1, "signcode01", true);
const user2 = gn.document.blocksign.user(signer2, "signcode02", false);
const document = gn.document.blocksign.document("docid01sdi", owner, "test-hs:01", creator, "test-doc-01", "12345", [user1, user2]);
```

If you want to know the meaning of each argument, go to [generator](#generator).

### Generate BlockCity Documents

The following types of blockcity documents are supported:

* User Data
* Land Data
* Voting Data
* History Data

Document IDs for each document type have their own suffixes.

* user data: cui
* land data: cli
* vote data: cvi
* history data: chi

The document types above are used only for 'blockcity'.

#### User Document

Before you create 'user document', you need to prepare the following:

* document id
* Each value for user statistics
* document owner
* user's gold and bank gold

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const owner = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const statistics = gn.document.blockcity.userStatistics(1, 1, 1, 1, 1, 1, 1, 1);
const document = gn.document.blockcity.userDocument("4000cui", owner, 1, 1, statistics);
```

#### Land Document

What you must prepare are,

* document id
* document owner
* address to rent
* area to rent
* renter who rent
* account who rent
* rent date and period

```js
// same gn and owner with user document
const document = gn.document.blockcity.landDocument("4000cli", owner, "abcd", "city1", "foo", "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca", "2021-10-22", 10);
```

#### Vote Document

What you must prepare are,

* voting round
* end time of voting
* candidates - address, manifest, nickname and count
* boss name
* account address
* termofoffice

```js
// same gn and owner as user document
const c1 = "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca";
const c2 = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca";

const candidate1 = gn.document.blockcity.candidate(c1, "candidate01", "hello", 1);
const candidate2 = gn.document.blockcity.candidate(c2, "candidate02", "hi@", 2);
const document = gn.document.blockcity.voteDocument("4000cvi", owner, 1, "2022-01-01T03:02:01.333", [candidate1, candidate2], "boss01", "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca", "foo01");
```

#### History Document

What you must prepare are,

* document id
* document owner
* name
* account
* date
* usage
* application

```js
// same gn and owner as user document
const document = gn.document.blockcity.historyDocument("4000chi", owner, "user01", "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca", "2022-02-01T03:03:02.333", "usage1", "application1");
```

### Generate Create-Documents

All models based on 'mitum-documents' operate as 'create-documents' and 'update-documents'.

Therefore, this section introduces how to create 'create-documents' and 'update-documents' operations with prepared documents.

To prepare a document, go to the previous section.

To create a 'create-documents' operation, you must prepare the following:

* currency id for fees
* document
* sender's address and private key

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

// .. generate document

const item = gn.document.getCreateDocumentsItem(document, "PEN");
const fact = gn.document.getCreateDocumentsFact("5KGBDDsmNXCa69kVAgRxDovu7JWxdsUxtAz7GncKxRfqmca", [item]);

const operation = gn.getOperation(fact, "");
operation.addSign("Kz5gif6kskQA8HD6GeEjPse1LuqF8d3WFEauTSAuCwD1h94vboyAmpr");
```

See start of [Generate Document Operation](#generate-document-operation) for `Document`.

See [Generator](#generator) for more information.

### Generate Update-Documents

To generate create-documents operations, you have to prepare,

* currency id for fees
* document
* sender's address and private key

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

// .. generate document

const item = gn.document.getUpdateDocumentsItem(document, "PEN");
const fact = gn.document.getUpdateDocumentsFact("5KGBDDsmNXCa69kVAgRxDovu7JWxdsUxtAz7GncKxRfqmca", [item]);

const operation = gn.getOperation(fact, "");
operation.addSign("Kz5gif6kskQA8HD6GeEjPse1LuqF8d3WFEauTSAuCwD1h94vboyAmpr");
```

See start of [Generate Document Operation](#generate-document-operation) for `Document`.

See [Generator](#generator) for more information.

### Generate BlockSign Sign-Documents

As mentioned earlier, `sign-documents` operation is used only for 'blocksign'.

Therefore, you must use `Generator.document.blocksign`, a specific generator of blocksign, to generate 'sign-documents' fact and item.

To generate an item for sign-document's item,

* document id
* owner's address
* currency id for fee

You do not need to prepare documents for 'sign-documents'. Only document ID is required.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum'); // new Generator({networkId})

const item = gn.document.blocksign.getSignDocumentsItem("4000sdi", "5KGBDDsmNXCa69kVAgRxDovu7JWxdsUxtAz7GncKxRfqmca", "PEN");
const fact = gn.document.blocksign.getSignDocumentsFact("Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca", [item]);

const operation = gn.getOperation(fact, "");
operation.addSign("Kz5gif6kskQA8HD6GeEjPse1LuqF8d3WFEauTSAuCwD1h94vboyAmpr");
```

See [Generator](#generator) for more information.

## Generate FeeFi Operation

This part shows how to generate operations of the fefi model.

### Generate Pool-Register

`Pool-Register` supports the registration of `pool` in the contract account.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "73fmjoGTgzhpYQPwNrA6j3DbnoCfFH919uZf5LuT8JmWmca"; // target contract account address

const amount = gn.currency.amount("MCC", "100");

const poolRegisterFact = gn.feefi.getPoolRegisterFact(senderAddr, targetAddr, amount, "AAA", "BBB", "MCC"); // sender, target, amount, incoming cid, outgoding cid, cid
const poolRegister = gn.getOperation(poolRegisterFact, "");
poolRegister.addSign(senderPriv);
```

### Generate Pool-Policy-Updater

`Pool-Policy-Updater` supports to update a registered pool policy.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "73fmjoGTgzhpYQPwNrA6j3DbnoCfFH919uZf5LuT8JmWmca"; // target contract account address

const amount = gn.currency.amount("100", "MCC");

const poolPolicyUpdaterFact = gn.feefi.getPoolPolicyUpdaterFact(senderAddr, targetAddr, amount, "ABC", "MCC"); // sender, target, amount, pool id, currency id
const poolPolicyUpdater = gn.getOperation(poolPolicyUpdaterFact, "");
poolPolicyUpdater.addSign(senderPriv);
```

### Generate Pool-Deposits

`Pool-Deposits` supports depositing amounts into the pool.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "73fmjoGTgzhpYQPwNrA6j3DbnoCfFH919uZf5LuT8JmWmca"; // target contract account address

const amount = gn.currency.amount("100", "MCC");

const poolDepositsFact = gn.feefi.getPoolDepositsFact(senderAddr, targetAddr, "ABC", amount); // sender, pool, pool id, amount
const poolDeposits = gn.getOperation(poolDepositsFact, "");
poolDeposits.addSign(senderPriv);
```

### Generate Pool-Withdraw

`Pool-Withdraw` supports withdrawing amounts from the pool.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "73fmjoGTgzhpYQPwNrA6j3DbnoCfFH919uZf5LuT8JmWmca"; // target contract account address

const amount = gn.currency.amount("100", "MCC");
const amounts = gn.currency.amounts([amount])

const poolWithdrawFact = gn.feefi.getPoolWithdrawFact(senderAddr, targetAddr, "ABC", amounts) // sender, pool, pool id, amounts
const poolWithdraw = gn.getOperation(poolWithdrawFact, "")
poolWithdraw.addSign(senderPriv)
```

## Generate NFT Operation

This part shows how to generate operations of the nft model.

### Generate Collection-Register

`Collection-Register` supports the registration of `collection` in the contract account.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "73fmjoGTgzhpYQPwNrA6j3DbnoCfFH919uZf5LuT8JmWmca"; // target contract account address

const form = gn.nft.collectionRegisterForm(targetAddr, "AAA", "FirstCollection", 0, "https://localhost:5000/AAA"); // target, symbol, name, roylaty, uri

const collectionRegisterFact = gn.nft.getCollectionRegisterFact(senderAddr, form, "PEN"); // sender, form, cid
const collectionRegister = gn.getOperation(collectionRegisterFact, "");
collectionRegister.addSign(senderPriv);
```

### Generate NFT Mint

`NFT Mint` supports the registration of a new nft in the collection.

#### Usage

This example shows how to create an operation when both the creator and copyrighter are the same account as minting nft.
Actually, any general account can be a creator and a copyrighter.

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address

const creator = gn.nft.signer(senderAddr, 100, false);
const copyrighter = gn.nft.signer(senderAddr, 100, false);

const creators = gn.nft.signers(100, [creator]);
const copyrighters = gn.nft.signers(100, [copyrighter]);

const form = gn.nft.mintForm("hash"/* enter nft hash */, "https://localhost:5000/AAA/1", creators, copyrighters);
const mintItem = gn.nft.getMintItem("AAA", form, "PEN");

const mintFact = gn.nft.getMintFact(senderAddr, [mintItem]);
const mint = gn.getOperation(mintFact, "");
mint.addSign(senderPriv);
```

### Generate NFT Transfer

`NFT Transfer` supports the transfer of nft.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const targetAddr = "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca"; // receiver's account address

const transferItem = gn.nft.getTransferItem(targetAddr, "AAA-00001", "PEN"); // receiver, nid, cid
const transferFact = gn.nft.getTransferFact(senderAddr, [transferItem]);

const transfer = gn.getOperation(transferFact, "");
transfer.addSign(senderPriv);
```

### Generate NFT Burn

`NFT Burn` supports nft burning.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address

const burnItem = gn.nft.getBurnItem("AAA-00001", "PEN"); // nid, cid
const burnFact = gn.nft.getBurnFact(senderAddr, [burnItem]);

const burn = gn.getOperation(burnFact, "");
burn.addSign(senderPriv);
```

### Generate Approve

`NFT Approval` supports delegation of authority for specific nft ownership changes.

#### Usage

```js
import { Generator } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const approvedAddr = "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca"; // approved's account address

const approveItem = gn.nft.getApproveItem(approvedAddr, "AAA-00001", "PEN"); // approved, nid, cid
const approveFact = gn.nft.getApproveFact(senderAddr, [approveItem]);

const approve = gn.getOperation(approveFact, "");
approve.addSign(senderPriv);
```

### Generate Delegate

`NFT Delegation` supports delegating the authority to change ownership of all nfts held by one general account for a collection.

#### Usage

```js
import { Generator, modes } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address
const agentAddr = "Gu5xHjhos5WkjGo9jKmYMY7dwWWzbEGdQCs11QkyAhh8mca"; // agent's account address

const { DELEGATE_MODE } = modes;
const delegateItem = gn.nft.getDelegateItem("AAA", agentAddr, DELEGATE_MODE.allow, "PEN"); // collection, agent, delegate-mode[allow || cancel], cid
const delegateFact = gn.nft.getDelegateFact(senderAddr, [delegateItem]);

const delegate = gn.getOperation(delegateFact, "");
delegate.addSign(senderPriv);
```

### Generate NFT Sign

`NFT Sign` supports signing in nft as a creator or copyrighter.

#### Usage

```js
import { Generator, modes } from 'mitumc';

const gn = new Generator('mitum');

const senderPriv = "KxD8T82nfwsUmQu3iMXENm93YTTatGFp1AYDPqTo5e6ycvY1xNXpmpr"; // sender's private key
const senderAddr = "CY1pkxsqQK6XMbnK4ssDNbDR2K7mitSwdS27DwBjd3Gcmca"; // sender's account address

const { SIGN_QUALIFICATION } = modes;
const signItem = gn.nft.getSignItem(SIGN_QUALIFICATION.creator, "AAA-00001", "PEN"); // sign-qualification[creator || copyrighter], nid, cid
const signFact = gn.nft.getSignFact(senderAddr, [signItem]);

const sign = gn.getOperation(signFact, "");
sign.addSign(senderPriv);
```

## Generate New Seal

'mitum-js-util' supports you to create a seal consisting of various operations as a json file. All operations that can be created through 'mitum-js-util' are targeted.

### Prerequisite

To generate a seal, you need the following:

* `signing key`
* `a list of pre-constructed operations`

The `signing key` can be any mitum private key.

### JSONParser

You can create a json file using another module supported by javascript without the `JSONParser` class provided by mitumc. However, for convenience, we recommend using `JSONParser`.

`JSONParser` supports the following modules:

```js
JSONParser.toJSONString(seal)
JSONParser.getFile(seal, fName)
```

In the next part, we will introduce the use case of `JSONParser`.

#### Usage

First, assume that all operations are operations created by `Generator`. (such as create-accounts, key-updater, transfers, etc.)

```js
import { Generator, JSONParser } from 'mitumc';

const gn = new Generator('mitum'); // new mitumc.Generator({networkId})

// ... omitted
// Create each operation with generator.
// See above sections.
// ...

const signer = "KyK7aMWCbMtCJcneyBZXGG6Dpy2jLRYfx3qp7kxXJjLFnppRYt7wmpr";

const operations = [operation];
const seal = gn.getSeal(signer, operations);

JSONParser.toJSONString(seal);
JSONParser.getFile(seal, 'seal.json');
```

The result of `generateFile()` is the same as [this](example/seal.json). (Each value depends on input arguments and operation creation time)

Use `JSONParser.getFile(Operation.dict(), 'filename')` to create a json file for an operation (not a seal).

Do not use the Operation class immediately as an argument for `getFile()`. Before using `getFile()`, you must convert the Operation instance to a dictionary object using `Operation.dict()`.

## Send Seal to Network

Use `curl` to broadcast your operations.

```shell
~$ curl -X POST -H "Content-Type: application/json" -d @seal.json https://{mitum network address}/builder/send
```

* `seal.json` is your seal file.

## Sign Message

Sign messages with your keypair.

`mitumc` supports the generation of new keypairs. Signing with a keypair gives you a signature digest.

### Usage

#### Sign String/Bytes

Each `Keypair` supports the `sign` method, which generates a buffer type signature by signing a buffer type message.

To obtain a string signature that is compatible with 'mitum', use `bs58` to encode the signature.

```js
import { getNewKeypair } from 'mitumc';
import bs58 from 'bs58';

const msg = Buffer.from('mitum');

const kp = getNewKeypair();
const sign = kp.sign(msg); // <Buffer 30 44 02 20 10 59 3d a8 e5 52 5b 46 1e da 16 a2 2b d7 55 77 6a 69 b7 44 12 9d a7 8a 49 45 4d 6a 2f f8 97 aa 02 20 01 10 50 7f 14 a8 9d 28 fd bd 5a 28 ... 20 more bytes>

bs58.encode(sign); // '381yXYmfPnG4vefuMCQNhZzQzBbscttUvhuxUr4y62EvWCWUwtMXoUgVZGysA2jSEtPKBJevtD4nrsePdiQKdGjwrzqgJSev'
```

## Add Fact Signature to Operation

You can add a new fact signature to the json operation by using `Signer` in mitum-js-util.

To add a signature, you must prepare `network id` and `signing key`.

### Usage

For example, suppose the following json file has an operation already prepared.

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

Use `Signer.signOperation(operation-file-path)` to add a new fact signature to the `fact_signs` key.

The `operation hash` always changes after adding a fact signature.

```js
import { Signer, JSONParser } from 'mitumc';

const signer = new Signer('mitum', "L3CQHoKPJnK61LZhvvvfRouvAjVVabx2RQXHHhPHbBssgcewjgNimpr");

/* Signer.signOperation(#target) */
/* #target must be either a dictionary style object or a path to the operation json file. */
const newOperation = signer.signOperation('operation.json');

JSONParser.getFile(newOperation, 'signed.json');
```

After signing, the above operation change as follows. (each value may vary depending on input arguments and operation creation time)

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

`Signer` does not create json files for new operations.

Use `JSONParser` if you need.

## Appendix

### __About Time Stamp__

#### __Expression of Time Stamp__

For blocks, seals, signatures, etc., mitum uses expressions `yyyy-MM-dd HH:mm:ss.* +0000 UTC` and `yyyy-MM-ddTHH:mm:ss.*Z` as the default.

All other timezones are not allowed! Only +0000 timezone must be used for mitum.

For example,

1. When converting timestamps to byte format to generate block/seal/fact_sign hash
    - convert string `2021-11-16 01:53:30.518 +0000 UTC` to byte format

2. When are placed in block, seal, fact_sign of json files
    - convert the timestamp to `2021-11-16T01:53:30.518Z` and put it in json

To generate an operation hash, mitum concatenates byte arrays of network id, fact hash and each byte array of fact_sign.

And to generate each byte array of fact_sign, mitum concatenates byte arrays of signer, signature digest and signed_at.

Note that when converted to bytes, the format of `signed_at` is the same as `yyyy-MM-dd HH:mm:ss.* +0000 UTC`, but when put into json, it is displayed as `yyyy-MM-ddTHH:mm:ss.*Z`.

#### __How many decimal places to be expressed?__

There is one more thing to note.

First, there is no need to pay attention to the decimal places in the 'ss.*' part of the timestamp.

Moreover, the timestamp can also be written without `.` or without decimal values below `.`.

However, when converting timestamps to byte format, you should not add unnecessary zero(0) to floating point representations in seconds(ss.*).

For example,

1. `2021-11-16T01:53:30.518Z` is converted to `2021-11-16 01:53:30.518 +0000 UTC` without any change of the time itself.

2. `2021-11-16T01:53:30.510Z` must be converted to `2021-11-16 01:53:30.51 +0000 UTC` when generating a hash.

3. `2021-11-16T01:53:30.000Z` must be converted to `2021-11-16T01:53:30 +0000 UTC` when generating a hash.

A timestamp with unnecessary zeros in the json file does not affect the processing of blocks, seals, or operations. Use caution when converting formats.

### License

[GNU GENERAL PUBLIC LICENSE Version 3](LICENSE)