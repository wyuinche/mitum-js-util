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

// util
const { _hint, BigInteger } = require("../../util");

// hint
const { MNFT_COLLECTION_REGISTER_FORM, MNFT_SIGNER, MNFT_MINT_FORM, MNFT_NFT_ID, MNFT_SIGNERS, MNFT_COLLECTION_POLICY } = require("../../hint");

// key
const { Address } = require("../../key");


class CollectionRegisterForm {
    constructor(target, symbol, name, royalty, uri, whites) {
        if(royalty < 0 || royalty >= 100) {
            throw new RangeError(`royalty < 0 or royalty >= 100 :: CollectionRegisterForm; royalty is in the invalid range. valid: 0 <= royalty < 100.`);
        }
        this.hint = _hint(MNFT_COLLECTION_REGISTER_FORM);
        this.target = new Address(target);
        this.symbol = symbol;
        this.name = name;
        this.royalty = new BigInteger((royalty).toString());
        this.uri = uri;
        this.whites = whites.map(w => new Address(w))
    }

    buffer() {
        const bTarget = this.target.buffer();
        const bSymbol = Buffer.from(this.symbol);
        const bName = Buffer.from(this.name);
        const bRoyalty = this.royalty.buffer();
        const bUri = Buffer.from(this.uri);
        const bWhites = Buffer.concat(this.whites.map(w => w.buffer()))

        return Buffer.concat([bTarget, bSymbol, bName, bRoyalty, bUri, bWhites]);
    }

    dict() {
        const form = {};

        form._hint = this.hint;
        form.target = this.target.typed();
        form.symbol = this.symbol;
        form.name = this.name;
        form.royalty = this.royalty.value;
        form.uri = this.uri;
        form.whites = this.whites.map(w => w.typed());
        
        return form;
    }
}


class CollectionPolicy {
    constructor(name, royalty, uri, whites) {
        if(royalty < 0 || royalty >= 100) {
            throw new RangeError(`royalty < 0 or royalty >= 100 :: CollectionPolicy; royalty is in the invalid range. valid: 0 <= royalty < 100.`);
        }
        this.hint = _hint(MNFT_COLLECTION_POLICY)
        this.name = name;
        this.royalty = new BigInteger((royalty).toString());
        this.uri = uri;
        this.whites = whites.map(w => new Address(w));
    }

    buffer() {
        const bName = Buffer.from(this.name);
        const bRoyalty = this.royalty.buffer();
        const bUri = Buffer.from(this.uri);
        const bWhites = Buffer.concat(this.whites.map(w => w.buffer()))

        return Buffer.concat([bName, bRoyalty, bUri, bWhites]);
    }

    dict() {
        const policy = {}

        policy._hint = this.hint;
        policy.name = this.name;
        policy.royalty = this.royalty.value;
        policy.uri = this.uri;
        policy.whites = this.whites.map(w => w.typed());

        return policy;
    }
}


class NFTSigner {
    constructor(account, share, signed) {
        if(share < 0 || share > 100) {
            throw new RangeError(`share < 0 or share > 100 :: NFTSigner; share is in the invalid range. valid: 0 <= share <= 100.`);
        }
        this.hint = _hint(MNFT_SIGNER);
        this.account = new Address(account);
        this.share = new BigInteger((share).toString());
        this.signed = signed;
    }

    buffer() {
        const bAccount = this.account.buffer();
        const bShare = this.share.buffer();
        const bSigned = new Uint8Array([this.signed ? 1 : 0]);

        return Buffer.concat([bAccount, bShare, bSigned]);
    }

    dict() {
        const signer = {};

        signer._hint = this.hint;
        signer.account = this.account.typed();
        signer.share = this.share.value;
        signer.signed = this.signed;

        return signer;
    }
}


class NFTSigners {
    constructor(total, signers) {
        if(total < 0 || total > 100) {
            throw new RangeError(`total < 0 or total > 100 :: NFTSigners; total is in the invalid range. valid: 0 <= total <= 100.`);
        }
        this.hint = _hint(MNFT_SIGNERS);
        this.total = new BigInteger((total).toString());
        this.signers = signers;
    }

    buffer() {
        const bTotal = this.total.buffer();
        const bSigners = Buffer.concat(this.signers.map(s => s.buffer()));
        
        return Buffer.concat([bTotal, bSigners]);
    }

    dict() {
        const signers = {};

        signers._hint = this.hint;
        signers.total = this.total.value;
        signers.signers = this.signers.map(s => s.dict());

        return signers;
    }
}


class MintForm {
    constructor(hash, uri, creators, copyrighters) {
        this.hint = _hint(MNFT_MINT_FORM);
        this.nftHash = hash;
        this.uri = uri;
        this.creators = creators;
        this.copyrighters = copyrighters;
    }

    buffer() {
        const bHash = Buffer.from(this.nftHash);
        const bUri = Buffer.from(this.uri);
        const bCreators = this.creators.buffer();
        const bCopyrighters = this.copyrighters.buffer();

        return Buffer.concat([bHash, bUri, bCreators, bCopyrighters]);
    }

    dict() {
        const form = {};

        form._hint = this.hint;
        form.hash = this.nftHash;
        form.uri = this.uri;
        form.creators = this.creators.dict();
        form.copyrighters = this.copyrighters.dict();

        return form;
    }
}


class NFTID {
    constructor(collection, idx) {
        if (idx.compare(new BigInteger("0")) <= 0) {
            throw new RangeError(`idx == 0 :: NFTID; idx of nft id must be over zero. valid: idx > 0.`);
        } 
        this.hint = _hint(MNFT_NFT_ID);
        this.collection = collection;
        this.idx = idx;
    }

    buffer() {
        const bCollection = Buffer.from(this.collection);
        const bIdx = this.idx.buffer();

        return Buffer.concat([bCollection, bIdx]);
    }

    dict() {
        const id = {};

        id._hint = this.hint;
        id.collection = this.collection;
        id.idx = this.idx.value;

        return id;
    }
}


const DELEGATE_MODE = {
    allow: "allow",
    cancel: "cancel",
};


const SIGN_QUALIFICATION = {
    creator: "creator",
    copyrighter: "copyrighter",
};


module.exports = {
    CollectionRegisterForm,
    CollectionPolicy,
    NFTSigner,
    NFTSigners,
    MintForm,
    NFTID,
    DELEGATE_MODE,
    SIGN_QUALIFICATION,
};