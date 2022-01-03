/*
    mitum-js-util SDK for mitum-currency and mitum-data-blocksign
    Copyright (C) 2022 ProtoconNet

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

const { BlockSignItem } = require('./base');
const { Address } = require('../../key');
const { BigInteger } = require('../../util');


class CreateDocumentsItem extends BlockSignItem {

    constructor(type, fileHash, did, signcode, title, size, cid, signers, signcodes) {
        super(type);
        this.fileHash = fileHash;
        this.did = new BigInteger(did.toString());
        this.signcode = signcode;
        this.title = title;
        this.size = new BigInteger(size.toString());
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
};


class SignDocumentsItem extends BlockSignItem {

    constructor(type, owner, did, cid) {
        super(type);
        this.owner = new Address(owner);
        this.did = new BigInteger(did.toString());
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
};


class TransferDocumentsItem extends BlockSignItem {

    constructor(type, owner, receiver, did, cid) {
        super(type);
        this.owner = new Address(owner);
        this.receiver = new Address(receiver);
        this.did = new BigInteger(did.toString());
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
};


module.exports = {
    CreateDocumentsItem,
    TransferDocumentsItem,
    SignDocumentsItem,
};