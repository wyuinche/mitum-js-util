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

// hint
const { 
    MNFT_COLLECTION_REGISTER_OP_FACT, MNFT_COLLECTION_REGISTER_OP, MNFT_MINT_OP_FACT, MNFT_MINT_OP, 
    MNFT_TRANSFER_OP_FACT, MNFT_TRANSFER_OP, MNFT_BURN_OP, MNFT_BURN_OP_FACT, MNFT_APPROVE_OP_FACT, 
    MNFT_APPROVE_OP, MNFT_DELEGATE_OP_FACT, MNFT_DELEGATE_OP, MNFT_SIGN_OP_FACT, MNFT_SIGN_OP 
} = require("../../hint");

// key
const { Address } = require("../../key");

// operation
const { PurposedOperationFact, GeneralOperationFact } = require("../base");

// encode
const bs58 = require('bs58');


class CollectionRegisterFact extends PurposedOperationFact {
    constructor(sender, form, cid) {
        super(MNFT_COLLECTION_REGISTER_OP_FACT);
        this.sender = new Address(sender);
        this.form = form;
        this.cid = cid;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bForm = this.form.buffer();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bToken, bSender, bForm, bCid]);
    }

    dict() {
        const fact = {};

        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.form = this.form.dict();
        fact.currency = this.cid;

        return fact;
    }

    get operationHint() {
        return MNFT_COLLECTION_REGISTER_OP;
    }
}


class MintFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MNFT_MINT_OP_FACT, sender, items);
    }

    get operationHint() {
        return MNFT_MINT_OP;
    }
}


class NFTTransferFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MNFT_TRANSFER_OP_FACT, sender, items);
    }

    get operationHint() {
        return MNFT_TRANSFER_OP;
    }
}


class BurnFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MNFT_BURN_OP_FACT, sender, items);
    }

    get operationHint() {
        return MNFT_BURN_OP;
    }
}


class ApproveFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MNFT_APPROVE_OP_FACT, sender, items);
    }

    get operationHint() {
        return MNFT_APPROVE_OP;
    }
}


class DelegateFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MNFT_DELEGATE_OP_FACT, sender, items);
    }

    get operationHint() {
        return MNFT_DELEGATE_OP;
    }
}


class NFTSignFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MNFT_SIGN_OP_FACT, sender, items);
    }

    get operationHint() {
        return MNFT_SIGN_OP;
    }
}


module.exports = {
    CollectionRegisterFact, 
    MintFact,
    NFTTransferFact,
    BurnFact,
    ApproveFact,
    DelegateFact,
    NFTSignFact,
};