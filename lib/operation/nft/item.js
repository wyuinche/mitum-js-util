/*
    mitum-js-util SDK for mitum-currency, mitum-document
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

const { NFTID } = require("./base");

// util
const { parseNFTID } = require("../../util");

// hint
const { MNFT_MINT_ITEM, MNFT_TRANSFER_ITEM, MNFT_BURN_ITEM, MNFT_APPROVE_ITEM, MNFT_DELEGATE_ITEM, MNFT_SIGN_ITEM } = require("../../hint");

// key
const { Address } = require("../../key");

// operation
const { Item } = require("../base");


class NFTItem extends Item {
    constructor(type, cid) {
        super(type);
        this.cid = cid;
    }
}


class MintItem extends NFTItem {
    constructor(collection, form, cid) {
        super(MNFT_MINT_ITEM, cid);
        this.collection = collection;
        this.form = form;
    }

    buffer() {
        const bCollection = Buffer.from(this.collection);
        const bForm = this.form.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bCollection, bForm, bCid]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.collection = this.collection;
        item.form = this.form.dict();
        item.currency = this.cid;

        return item;
    }
}


class NFTTransferItem extends NFTItem {
    constructor(receiver, nid, cid) {
        super(MNFT_TRANSFER_ITEM, cid);

        const id = parseNFTID(nid);
        this.nid = new NFTID(id.collection, id.idx);
        this.receiver = new Address(receiver);
    }

    buffer() {
        const bReceiver = this.receiver.buffer();
        const bNid = this.nid.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bReceiver, bNid, bCid]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.receiver = this.receiver.typed();
        item.nft = this.nid.dict();
        item.currency = this.cid;

        return item;
    }
}


class BurnItem extends NFTItem {
    constructor(nid, cid) {
        super(MNFT_BURN_ITEM, cid);

        const id = parseNFTID(nid);
        this.nid = new NFTID(id.collection, id.idx);
    }

    buffer() {
        const bNid = this.nid.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bNid, bCid]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.nft = this.nid.dict();
        item.currency = this.cid;

        return item;
    }
}


class ApproveItem extends NFTItem {
    constructor(approved, nid, cid) {
        super(MNFT_APPROVE_ITEM, cid);
        
        const id = parseNFTID(nid);
        this.nid = new NFTID(id.collection, id.idx);
        this.approved = new Address(approved);
    }

    buffer() {
        const bApproved = this.approved.buffer();
        const bNid = this.nid.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bApproved, bNid, bCid]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.approved = this.approved.typed();
        item.nft = this.nid.dict();
        item.currency = this.cid;

        return item;
    }
}


class DelegateItem extends NFTItem {
    constructor(collection, agent, mode, cid) {
        super(MNFT_DELEGATE_ITEM, cid);
        this.collection = collection;
        this.agent = new Address(agent);
        this.mode = mode;
    }

    buffer() {
        const bCollection = Buffer.from(this.collection);
        const bAgent = this.agent.buffer();
        const bMode = Buffer.from(this.mode);
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bCollection, bAgent, bMode, bCid]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.collection = this.collection;
        item.agent = this.agent.typed();
        item.mode = this.mode;
        item.currency = this.cid;

        return item;
    }
}


class NFTSignItem extends NFTItem {
    constructor(qualification, nid, cid) {
        super(MNFT_SIGN_ITEM, cid);

        const id = parseNFTID(nid);
        this.nid = new NFTID(id.collection, id.idx);
        this.qualification = qualification;
    }

    buffer() {
        const bQualification = Buffer.from(this.qualification);
        const bNid = this.nid.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bQualification, bNid, bCid]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.qualification = this.qualification;
        item.nft = this.nid.dict();
        item.currency = this.cid;

        return item;
    }
}


module.exports = {
    MintItem,
    NFTTransferItem,
    BurnItem,
    ApproveItem,
    DelegateItem,
    NFTSignItem,
};