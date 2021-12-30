/*
    mitum-js-util SDK for mitum-currency and mitum-data-blocksign
    Copyright (C) 2021 ProtoconNet

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* SDK module */
const Sign = require('./sign');
const Util = require('./util');
const Hint = require('./hint');
const Key = require('./key');

/* base58 package */
const bs58 = require('bs58');


class Amount {
    constructor(big, cid) {
        if (typeof big !== "string") {
            throw new Error("[ERROR] Invalid amount(big) type for BigInteger! Use string.");
        }

        this.hint = Util._hint(Hint.MC_AMOUNT);
        this.big = new Util.BigInteger(big);
        this.cid = cid;
    }

    buffer() {
        const bBig = this.big.tight();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bBig, bCid]);
    }

    dict() {
        const amount = {};
        amount._hint = this.hint;
        amount.amount = this.big.rawValue;
        amount.currency = this.cid;
        return amount;
    }
};


class Address {

    constructor(addr) {
        let parsed = Util.parseTyped(addr);

        this.type = parsed.type;
        this.addr = parsed.raw;

        if (this.type !== Hint.MC_ADDRESS) {
            throw '[ERROR] Invalid typed address for Address';
        }
    }

    buffer() {
        return Buffer.from(this.typed());
    }

    typed() {
        return this.addr + this.type;
    }
};


class Item {

    constructor(type, amounts) {
        this.hint = Util._hint(type);
        this.amounts = amounts;
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }
};

class BlockSignItem {

    constructor(type) {
        this.hint = Util._hint(type);
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }
};


class CreateAccountsItem extends Item {

    constructor(type, keys, amounts) {
        super(type, amounts);
        this.keys = keys;
    }

    buffer() {
        const bKeys = this.keys.buffer();
        const bAmounts = Util.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bKeys, bAmounts]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.keys = this.keys.dict();

        const amounts = [];
        for (var i = 0; i < this.amounts.length; i++) {
            amounts.push(
                this.amounts[i].dict()
            );
        }
        item.amounts = amounts;

        return item;
    }
};

class TransfersItem extends Item {

    constructor(type, receiver, amounts) {
        super(type, amounts);
        this.receiver = new Address(receiver);
    }

    buffer() {
        const bReceiver = this.receiver.buffer();
        const bAmounts = Util.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bReceiver, bAmounts]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.receiver = this.receiver.typed();

        const amounts = [];
        for (var i = 0; i < this.amounts.length; i++) {
            amounts.push(
                this.amounts[i].dict()
            );
        }
        item.amounts = amounts;
        return item;
    }
};

class CreateDocumentsItem extends BlockSignItem {

    constructor(type, fileHash, did, signcode, title, size, cid, signers, signcodes) {
        super(type);
        this.fileHash = fileHash;
        this.did = new Util.BigInteger(did.toString());
        this.signcode = signcode;
        this.title = title;
        this.size = new Util.BigInteger(size.toString());
        this.cid = cid;
        this.signers = signers;
        this.signcodes = signcodes;
    }

    
    buffer() {
        const bFh = Buffer.from(this.fileHash);
        const bDid = this.did.tight();
        const bScode = Buffer.from(this.signcode);
        const bTitle = Buffer.from(this.title);
        const bSize = this.size.tight();
        const bCid = Buffer.from(this.cid);

        let bSigners = Buffer.alloc(0);
        for (let i = 0; i < this.signers.length; i++) {
            bSigners = Buffer.concat([bSigners, Buffer.from(this.signers[i])]);
        }

        let bScodes = Buffer.alloc(0);
        for (let i = 0; i < this.signcodes.length; i++) {
            bScodes = Buffer.concat([bScodes, Buffer.from(this.signcodes[i])]);
        }

        return Buffer.concat([bFh, bDid, bScode, bTitle, bSize, bCid, bSigners, bScodes]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.filehash = this.fileHash;
        item.documentid = "" + this.did.value;
        item.signcode = this.signcode;
        item.title = this.title;
        item.size = "" + this.size.value;
        item.signers = this.signers;
        item.signcodes = this.signcodes;
        item.currency = this.cid;
        return item;
    }
}

class SignDocumentsItem extends BlockSignItem {

    constructor(type, owner, did, cid) {
        super(type);
        this.owner = new Address(owner);
        this.did = new Xutil.BigInteger(did.toString());
        this.cid = cid;
    }

    buffer() {
        const bDid = this.did.tight();
        const bOwner = this.owner.buffer();
        const bCid = Buffer.from(this.cid);
        return Buffer.concat([bDid, bOwner, bCid]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.documentid = "" + this.did.value;
        item.owner = this.owner.typed();
        item.currency = this.cid;
        return item;
    }
}

class TransferDocumentsItem extends BlockSignItem {

    constructor(type, owner, receiver, did, cid) {
        super(type);
        this.owner = new Address(owner);
        this.receiver = new Address(receiver);
        this.did = new Util.BigInteger(did.toString());
        this.cid = cid;
    }

    buffer() {
        const bDid = this.did.tight();
        const bOwner = this.owner.buffer();
        const bReceiver = this.receiver.buffer();
        const bCid = Buffer.from(this.cid);
        return Buffer.concat([bDid, bOwner, bReceiver, bCid]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.documentid = "" + this.did.value;
        item.owner = this.owner.typed();
        item.receiver = this.receiver.typed();
        item.currency = this.cid;
        return item;
    }
}

class OperationFact {
    
    constructor(type) {
        this.hint = Util._hint(type);
        this.token = Util.getTimeStamp();
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }

    _generateHash() {
        this.hash = Util.sum256(this.buffer());
    }
};


class CreateAccountsFact extends OperationFact {

    constructor(sender, items) {
        super(
            Hint.MC_CREATE_ACCOUNTS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bItems = Util.concatObjectsToBuffer(this.items);

        return Buffer.concat([bToken, bSender, bItems]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();

        const items = [];
        for (var i = 0; i < this.items.length; i++) {
            items.push(
                this.items[i].dict()
            )
        }
        fact.items = items;

        return fact;
    }
};


class KeyUpdaterFact extends OperationFact {

    constructor(target, cid, keys) {
        super(
            Hint.MC_KEYUPDATER_OP_FACT
        );
        this.target = new Address(target);
        this.cid = cid;
        this.keys = keys;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bTarget = this.target.buffer();
        const bKeys = this.keys.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bToken, bTarget, bKeys, bCid]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.target = this.target.typed();
        fact.keys = this.keys.dict();
        fact.currency = this.cid;
        return fact;
    }
};


class TransfersFact extends OperationFact {

    constructor(sender, items) {
        super(
            Hint.MC_TRANSFERS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bItems = Util.concatObjectsToBuffer(this.items);

        return Buffer.concat([bToken, bSender, bItems]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();

        const items = [];
        for (var i = 0; i < this.items.length; i++) {
            items.push(
                this.items[i].dict()
            );
        }
        fact.items = items;

        return fact;
    }
};


class BlockSignFact extends OperationFact {
    constructor(type, sender, items) {
        super(type);
        this.sender = new Address(sender);
        this.items = items;
        this.type = type;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bItems = Util.concatObjectsToBuffer(this.items);

        return Buffer.concat([bToken, bSender, bItems]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();

        const items = [];
        for (var i = 0; i < this.items.length; i++) {
            items.push(
                this.items[i].dict()
            );
        }
        fact.items = items;

        return fact;
    }
}


class Operation {

    constructor(netID, type, memo, fact) {
        this.netID = netID;
        this.hint = Xutil._hint(type);
        this.memo = memo;
        this.fact = fact;
        this.fact_signs = [];
        this.hash = undefined;
    }

    _generateFactSign(sk) {
        return Sign.newFactSign(
            Buffer.concat([
                this.fact.hash,
                Buffer.from(this.netID)
            ]),
            sk
        );
    }

    _generateHash() {
        this.hash = Util.sum256(this.buffer());
    }

    /**
     * Adds fact_sign to fact_signs.
     * hash will be calculated again after adding fact_sign.
     * @param {string} sk Signing key with type suffix (mpr)
     */
    addSign(sk) {
        this.fact_signs.push(
            this._generateFactSign(sk, this.netID)
        );
        this._generateHash();
    }

    buffer() {
        if (this.fact_signs.length < 1) {
            throw '[ERROR] Empty fact sign!'
        }

        const bHash = this.fact.hash;
        const bFactSigns = Util.concatObjectsToBuffer(this.fact_signs)
        const bMemo = Buffer.from(this.memo);

        return Buffer.concat([bHash, bFactSigns, bMemo]);
    }

    /**
     * Returns operation in dictionary type.
     * Each value will be converted into a format suitable for sending the operation to the network.
     * @returns 
     */
    dict() {
        const operation = {};
        operation.memo = this.memo;
        operation._hint = this.hint;
        operation.fact = this.fact.dict();
        operation.hash = bs58.encode(this.hash);

        const fact_signs = [];
        for (var i = 0; i < this.fact_signs.length; i++) {
            fact_signs.push(
                this.fact_signs[i].dict()
            );
        }
        operation.fact_signs = fact_signs;

        return operation;
    }
};

module.exports = {
    Amount,
    Address,
    CreateAccountsItem,
    TransfersItem,
    BlockSignItem,
    CreateDocumentsItem,
    SignDocumentsItem,
    TransferDocumentsItem,
    CreateAccountsFact,
    KeyUpdaterFact,
    TransfersFact,
    BlockSignFact,
    OperationFact,
    Operation,
};
