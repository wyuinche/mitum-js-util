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
const Operation = require('./operation');
const Sign = require('./sign');
const Util = require('./util');
const Hint = require('./hint');
const Key = require('./key');

/* base58 package */
const bs58 = require('bs58');

const _toKeys = (ks, threshold) => {
    const _keys = [];

    for (var i = 0; i < ks.length; i++) {
        _keys.push(
            new Key.Key(
                ks[i].key,
                ks[i].weight
            )
        )
    }

    const keys = new Key.Keys(
        _keys,
        threshold,
    );

    return keys;
};

const _toAmounts = (amounts) => {
    const _amounts = [];

    for (var i = 0; i < amounts.length; i++) {
        _amounts.push(
            new Operation.Amount(
                amounts[i].big,
                amounts[i].cid
            )
        );
    }

    return _amounts;
};


class Generator {

    constructor(netID) {
        this.netID = netID;

        this.BLOCKSIGN_CREATE_DOCUMENTS = "CREATE-DOCUMENTS";
        this.BLOCKSIGN_SIGN_DOCUMENTS = "SIGN_DOCUMENTS";
        this.BLOCKSIGN_TRANSFER_DOCUMENTS = "TRANSFER_DOCUMENTS";
    }

    get id() {
        return this.netID;
    }

    setNetworkID(_id) {
        this.netID = _id;
    }

    key(key, weight) {
        const parsed = Util.parseTyped(key);

        if (parsed.type !== Hint.PUBLIC_KEY) {
            throw '[ERROR] Invalid key';
        }
        if (typeof (weight) !== 'number') {
            throw '[ERROR] Invalid weight'
        }
        return {
            key: key,
            weight: weight
        };
    }

    amount(big, cid) {
        if (!typeof (big) === "string") {
            throw '[ERROR] Invalid amount! big must be string format.';
        }
        if (cid.length < 1) {
            throw '[ERROR] Invalid currency id';
        }
        return {
            big: big,
            cid: cid
        }
    }

    createKeys(keys, threshold) {
        return _toKeys(keys, threshold);
    };

    createAmounts(amounts) {
        return _toAmounts(amounts);
    };

    createCreateAccountsItem(keys, amounts) {
        const _type = amounts.length <= 1 ? Hint.MC_CREATE_ACCOUNTS_SINGLE_AMOUNT : Hint.MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS;
        return new Operation.CreateAccountsItem(
            _type, keys, amounts
        );
    };

    createTransfersItem(receiver, amounts) {
        const _type = amounts.length <= 1 ? Hint.MC_TRANSFERS_ITEM_SINGLE_AMOUNT : Hint.MC_TRANSFERS_ITEM_MULTI_AMOUNTS;
        return new Operation.TransfersItem(
            _type, receiver, amounts
        )
    };

    createCreateDocumentsItem(fileHash, did, signcode, title, size, cid, signers, signcodes) {
        return new Opeartion.CreateDocumentsItem(
            Hint.MBS_CREATE_DOCUMENTS_SINGLE_FILE,
            fileHash,
            did,
            signcode,
            title,
            size,
            cid,
            signers,
            signcodes
        )
    }

    createSignDocumentsItem(owner, did, cid) {
        return new Operation.SignDocumentsItem(
            Hint.MBS_SIGN_ITEM_SINGLE_DOCUMENT,
            owner,
            did,
            cid
        )
    }

    createTransferDocumentsItem(owner, receiver, did, cid) {
        return new Operation.TransferDocumentsItem(
            Hint.MBS_TRANSFER_ITEM_SINGLE_DOCUMENT,
            owner,
            receiver,
            did,
            cid
        )
    }

    createCreateAccountsFact(sender, items) {
        return new Operation.CreateAccountsFact(
            sender, items
        );
    };

    createKeyUpdaterFact(target, cid, keys) {
        return new Operation.KeyUpdaterFact(
            target, cid, keys
        );
    };

    createTransfersFact(sender, items) {
        return new Operation.TransfersFact(
            sender, items
        )
    };

    createBlockSignFact(type, sender, items) {
        let _type;
        switch(type) {
            case this.BLOCKSIGN_CREATE_DOCUMENTS:
                _type = Hint.MBS_CREATE_DOCUMENTS_OP_FACT;
                break;
            case this.BLOCKSIGN_SIGN_DOCUMENTS:
                _type = Hint.MBS_SIGN_DOCUMENTS_OP_FACT;
                break;
            case this.BLOCKSIGN_TRANSFER_DOCUMENTS:
                _type = Hint.MBS_TRANSFER_DOCUMENTS_OP_FACT;
                break;
            default:
                throw '[ERROR] Invalid block-sign fact type';
        }
        
        return new Operation.BlockSignFact(
            _type,
            sender,
            items
        )
    }

    createOperation(fact, memo) {
        let _type;

        if (fact instanceof Operation.CreateAccountsFact) {
            _type = Hint.MC_CREATE_ACCOUNTS_OP;
        }
        else if (fact instanceof Operation.KeyUpdaterFact) {
            _type = Hint.MC_KEYUPDATER_OP;
        }
        else if (fact instanceof Operation.TransfersFact) {
            _type = Hint.MC_TRANSFERS_OP;
        }
        else if (fact instanceof Operation.BlockSignFact) {

            switch (fact.type) {
                case Hint.MBS_CREATE_DOCUMENTS_OP_FACT:
                    _type = Hint.MBS_CREATE_DOCUMENTS_OP;
                    break;
                case Hint.MBS_SIGN_DOCUMENTS_OP_FACT:
                    _type = Hint.MBS_SIGN_DOCUMENTS_OP;
                    break;
                case Hint.MBS_TRANSFER_DOCUMENTS_OP_FACT:
                    _type = Hint.MBS_TRANSFER_DOCUMENTS_OP;
                    break;
                default:
                    throw '[ERROR] Invalid fact object';
            }

        }
        else {
            throw '[ERROR] Invalid fact object';
        }

        return new Operation.Operation(
            this.netID, _type, memo, fact
        );
    };

    createSeal(sk, operations) {
        const keypair = Key.getKeypairFromPrivateKey(sk);
        const signedAt = Util.getTimeStamp();
        const bSignedAt = Buffer.from(Util.dateToUTC(signedAt));
        const bSigner = Buffer.from(keypair.getPublicKey());

        let bOperations = Buffer.from('');
        for (var i = 0; i < operations.length; i++) {
            bOperations = Buffer.concat([bOperations, operations[i].hash]);
        }

        const bodyHash = Util.sum256(
            Buffer.concat([bSigner, bSignedAt, bOperations]));

        const signature = keypair.sign(
            Buffer.concat(
                [bodyHash, Buffer.from(this.netID)]
            )
        );

        const hash = Util.sum256(
            Buffer.concat([bodyHash, signature])
        );

        const seal = {};
        seal._hint = Util._hint(Hint.SEAL);
        seal.hash = bs58.encode(hash);
        seal.body_hash = bs58.encode(bodyHash);
        seal.signer = keypair.getPublicKey();
        seal.signature = bs58.encode(signature);
        seal.signed_at = signedAt.toISOString();

        const _operations = [];
        for (var i = 0; i < operations.length; i++) {
            _operations.push(operations[i].dict());
        }
        seal.operations = _operations;

        return seal;
    };
};

const JSONParser = {

    toJSONString: (seal) => {
        return JSON.stringify(seal, null, 4);
    },

    generateFile: (seal, fName) => {
        const fs = require('fs');
        fs.writeFile(fName, JSON.stringify(seal, null, 4), (error) => {
            if (error) throw error;
        });
        console.log("generateFile() arg: " + fName + ", Success...");
    }
};

const _factSignToBuffer = (_fact_sign) => {
    const bSigner = Buffer.from(_fact_sign['signer']);
    const bSign = bs58.decode(_fact_sign['signature']);
    const bAt = Buffer.from(Util.ISOToUTC(_fact_sign['signed_at']));

    return Buffer.concat([bSigner, bSign, bAt]);
};

const _factSignsToBuffer = (_fact_signs) => {
    let buffer = Buffer.from('');
    for (var i = 0; i < _fact_signs.length; i++) {
        buffer = Buffer.concat([buffer, _factSignToBuffer(_fact_signs[i])]);
    }
    return buffer;
};

class Signer {
    constructor(netID, sk) {
        this.netID = netID;
        this.signKey = sk;
    }
    setNetId(_id) {
        this.netID = _id;
    }

    signOperation(f_oper) {
        const fs = require('fs');
        const before = typeof (f_oper) === 'string' ? JSON.parse(fs.readFileSync(f_oper))
            : (typeof (f_oper) === typeof ({}) ? f_oper : undefined);
        if (!before) {
            return undefined;
        }

        console.log(before)

        const after = {};
        const factHash = before['fact']['hash'];

        const bFactHash = bs58.decode(factHash);
        const factSigns = before['fact_signs'];

        factSigns.push(
            Sign.newFactSign(
                Buffer.concat([
                    bFactHash, Buffer.from(this.netID)
                ]),
                this.signKey
            ).dict()
        );
        const bFactSigns = _factSignsToBuffer(factSigns);

        after['memo'] = before['memo'];
        after['_hint'] = before['_hint'];
        after['fact'] = before['fact'];
        after['fact_signs'] = factSign;

        const bMemo = Buffer.from(before['memo']);
        after['hash'] = bs58.encode(
            Util.sum256(Buffer.concat([bFactHash, bFactSigns, bMemo]))
        );

        return after;
    }
}

module.exports = {
    Generator,
    JSONParser,
    Signer
};