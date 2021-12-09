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
const Xoper = require('./operation');
const Xsign = require('./sign');
const Xutil = require('./util');
const Xhint = require('./hint');
const Xkey = require('./key');

/* base58 package */
const bs58 = require('bs58');


/**
 * @function
 * Generate Keys object with key list.
 * @param {object} ks - Array that each element is simple key object # key{key, weight}
 * @param {number} threshold - Keys threshold
 * @return {Xkey.Keys} - Generate Keys object
 */
const _toKeys = (ks, threshold) => {
    const _keys = [];

    for (var i = 0; i < ks.length; i++) {
        _keys.push(
            new Xkey.Key(
                ks[i].key,
                ks[i].weight
            )
        )
    }

    const keys = new Xkey.Keys(
        _keys,
        threshold,
    );

    return keys;
};

/**
 * @function
 * Generate Amount object list with amounts.
 * @param {object} amts - Array that each element is simple amount object # amount{big, cid}
 * @return {object} - Amount obejct list
 */
const _toAmounts = (amts) => {
    const _amounts = [];

    for (var i = 0; i < amts.length; i++) {
        _amounts.push(
            new Xoper.Amount(
                amts[i].big,
                amts[i].cid
            )
        );
    }

    return _amounts;
};

/**
 * @class
 * Generates all objects that are necessary to create operations and seals.
 * @property {string} netID - Network ID
 */
class Generator {
    /**
     * @constructor
     * @param {string} netID - Network ID
     */
    constructor(netID) {
        this.netID = netID;

        this.BLOCKSIGN_CREATE_DOCUMENTS = "CREATE-DOCUMENTS";
        this.BLOCKSIGN_SIGN_DOCUMENTS = "SIGN_DOCUMENTS";
        this.BLOCKSIGN_TRANSFER_DOCUMENTS = "TRANSFER_DOCUMENTS";
    }

    /**
     * @property
     * @return {string} - Network ID
     */
    get id() {
        return this.netID;
    }

    /**
     * @method
     * Set new network ID.
     * @param {string} _id - new network ID
     */
    setNetworkID(_id) {
        this.netID = _id;
    }

    /**
     * @method
     * Create simple key object.
     * @param {string} key - Hinted key
     * @param {number} weight - weight
     * @return {object} - {key, weight}
     */
    formatKey(key, weight) {
        const parsed = Xutil.parseTyped(key);

        if (parsed.type !== Xhint.PUBLIC_KEY) {
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

    /**
     * @method
     * Create simple amount object.
     * @param {string} big - Target amount
     * @param {number} cid - Currency ID
     * @return {object} - {big, cid}
     */
    formatAmount(big, cid) {
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

    /**
     * @method
     * Create Keys object.
     * @param {object} keys - Array of simple key objects #{key, weight}
     * @param {number} threshold - threshold
     * @return {Xkey.Keys} - Created Keys object
     */
    createKeys(keys, threshold) {
        return _toKeys(keys, threshold);
    };

    /**
     * @method
     * Create Amount object Array.
     * @param {object} amounts - Array of simple amount objects #{big, cid}
     * @return {object} - Array of Amount obejcts
     */
    createAmounts(amts) {
        return _toAmounts(amts);
    };

    /**
     * @method
     * Create CreateAccountsItem object.
     * @param {Xkey.Keys} keys - Keys object
     * @param {object} amts - Array of Amount objects
     * @return {Xoper.CreateAccountsItem} - Created CreateAccountsItem object
     */
    createCreateAccountsItem(keys, amts) {
        const _type = amts.length <= 1 ? Xhint.MC_CREATE_ACCOUNTS_SINGLE_AMOUNT : Xhint.MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS;
        return new Xoper.CreateAccountsItem(
            _type, keys, amts
        );
    };

    /**
     * @method
     * Create TransfersItem object.
     * @param {string} receiver - Hinted receiver address
     * @param {object} amts - Array of Amount objects
     * @return {Xoper.TransfersItem} - Created TransfersItem object
     */
    createTransfersItem(receiver, amts) {
        const _type = amts.length <= 1 ? Xhint.MC_TRNASFERS_ITEM_SINGLE_AMOUNT : Xhint.MC_TRANSFERS_ITEM_MULTI_AMOUNTS;
        return new Xoper.TransfersItem(
            _type, receiver, amts
        )
    };

    createCreateDocumentsItem(fileHash, did, signcode, title, size, cid, signers, signcodes) {
        return new Xoper.CreateDocumentsItem(
            Xhint.MBS_CREATE_DOCUMENTS_SINGLE_FILE,
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
        return new Xoper.SignDocumentsItem(
            Xhint.MBS_SIGN_ITEM_SINGLE_DOCUMENT,
            owner,
            did,
            cid
        )
    }

    createTransferDocumentsItem(owner, receiver, did, cid) {
        return new Xoper.TransferDocumentsItem(
            Xhint.MBS_TRANSFER_ITEM_SINGLE_DOCUMENT,
            owner,
            receiver,
            did,
            cid
        )
    }

    /**
     * @method
     * Create CreateAccountsFact object.
     * @param {string} sender - Hinted sender address
     * @param {object} items - Array of CreateAccountsItem objects
     * @return {Xoper.CreateAccountsFact} - Created CreateAccountsFact object
     */
    createCreateAccountsFact(sender, items) {
        return new Xoper.CreateAccountsFact(
            sender, items
        );
    };

    /**
     * @method
     * Create KeyUpdaterFact object.
     * @param {string} target - Hinted target address
     * @param {string} cid - Currency ID
     * @param {Xkey.Keys} - Keys object
     * @return {Xoper.KeyUpdaterFact} - Created KeyUpdaterFact object
     */
    createKeyUpdaterFact(target, cid, keys) {
        return new Xoper.KeyUpdaterFact(
            target, cid, keys
        );
    };

    /**
     * @method
     * Create TransfersFact object.
     * @param {string} sender - Hinted sender address
     * @param {object} items - Array of TransfersItem objects
     * @return {Xoper.TransfersFact} - Created TransfersFact object
     */
    createTransfersFact(sender, items) {
        return new Xoper.TransfersFact(
            sender, items
        )
    };

    createBlockSignFact(type, sender, items) {
        let _type;
        switch(type) {
            case this.BLOCKSIGN_CREATE_DOCUMENTS:
                _type = Xhint.MBS_CREATE_DOCUMENTS_OP_FACT;
                break;
            case this.BLOCKSIGN_SIGN_DOCUMENTS:
                _type = Xhint.MBS_SIGN_DOCUMENTS_OP_FACT;
                break;
            case this.BLOCKSIGN_TRANSFER_DOCUMENTS:
                _type = Xhint.MBS_TRANSFER_DOCUMENTS_OP_FACT;
                break;
            default:
                throw '[ERROR] Invalid block-sign fact type';
        }
        
        return new Xoper.BlockSignFact(
            _type,
            sender,
            items
        )
    }

    /**
     * @method
     * Create Operation.
     * @param {Xoper.OperationFact} fact - Operation fact object
     * @param {string} memo - Operation memo
     * @return {Xoper.Operation} - Created Operation
     */
    createOperation(fact, memo) {
        let _type;

        if (fact instanceof Xoper.CreateAccountsFact) {
            _type = Xhint.MC_CREATE_ACCOUNTS_OP;
        }
        else if (fact instanceof Xoper.KeyUpdaterFact) {
            _type = Xhint.MC_KEYUPDATER_OP;
        }
        else if (fact instanceof Xoper.TransfersFact) {
            _type = Xhint.MC_TRANSFERS_OP;
        }
        else if (fact instanceof Xoper.BlockSignFact) {

            switch (fact.type) {
                case Xhint.MBS_CREATE_DOCUMENTS_OP_FACT:
                    _type = Xhint.MBS_CREATE_DOCUMENTS_OP;
                    break;
                case Xhint.MBS_SIGN_DOCUMENTS_OP_FACT:
                    _type = Xhint.MBS_SIGN_DOCUMENTS_OP;
                    break;
                case Xhint.MBS_TRANSFER_DOCUMENTS_OP_FACT:
                    _type = Xhint.MBS_TRANSFER_DOCUMENTS_OP;
                    break;
                default:
                    throw '[ERROR] Invalid fact object';
            }

        }
        else {
            throw '[ERROR] Invalid fact object';
        }

        return new Xoper.Operation(
            this.netID, _type, memo, fact
        );
    };

    /**
     * @method
     * Create Seal.
     * @param {string} sk - Hinted signing key
     * @param {object} opers - Array of Operation objects
     * @return {object} - Created seal object
     */
    createSeal(sk, opers) {
        const keypair = Xkey.getKeypairFromPrivateKey(sk);
        const signedAt = Xutil.getTimeStamp();
        const bsignedAt = Buffer.from(Xutil.dateToUTC(signedAt));
        const bsigner = Buffer.from(keypair.getPublicKey());

        let bopers = Buffer.from('');
        for (var i = 0; i < opers.length; i++) {
            bopers = Buffer.concat([bopers, opers[i].hash]);
        }

        const bodyHash = Xutil.sum256(
            Buffer.concat([bsigner, bsignedAt, bopers]));

        const signature = keypair.sign(
            Buffer.concat(
                [bodyHash, Buffer.from(this.netID)]
            )
        );

        const hash = Xutil.sum256(
            Buffer.concat([bodyHash, signature])
        );

        const seal = {};
        seal._hint = Xutil._hint(Xhint.SEAL);
        seal.hash = bs58.encode(hash);
        seal.body_hash = bs58.encode(bodyHash);
        seal.signer = keypair.getPublicKey();
        seal.signature = bs58.encode(signature);
        seal.signed_at = signedAt.toISOString();

        const operations = [];
        for (var i = 0; i < opers.length; i++) {
            operations.push(opers[i].dict());
        }
        seal.operations = operations;

        return seal;
    };
};

/**
 * @constructor
 * Converts seal to dictionary-format string and Generates json file.
 */
const JSONParser = {
    /**
     * @method
     * Seal to dictionary-format string
     * @param {object} seal - seal/operation object
     * @return {string} - Converted seal
     */
    toJSONString: (seal) => {
        return JSON.stringify(seal, null, 4);
    },
    /**
     * @method
     * Generate json file.
     * @param {object} seal - seal/operation object
     * @param {string} fName - file to generate # file name must be '*.json' format
     */
    generateFile: (seal, fName) => {
        const fs = require('fs');
        fs.writeFile(fName, JSON.stringify(seal, null, 4), (error) => {
            if (error) throw error;
        });
        console.log("generateFile() arg: " + fName + ", Success...");
    }
};

const _factSignToBuffer = (_fact_sign) => {
    const bsigner = Buffer.from(_fact_sign['signer']);
    const bsign = bs58.decode(_fact_sign['signature']);
    const bat = Buffer.from(Xutil.ISOToUTC(_fact_sign['signed_at']));

    return Buffer.concat([bsigner, bsign, bat]);
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

        const bfactHash = bs58.decode(factHash);
        const factSign = before['fact_signs'];

        factSign.push(
            Xsign.newFactSign(
                Buffer.concat([
                    bfactHash, Buffer.from(this.netID)
                ]),
                this.signKey
            ).dict()
        );
        const bfact_sg = _factSignsToBuffer(factSign);

        after['memo'] = before['memo'];
        after['_hint'] = before['_hint'];
        after['fact'] = before['fact'];
        after['fact_signs'] = factSign;

        const bmemo = Buffer.from(before['memo']);
        after['hash'] = bs58.encode(
            Xutil.sum256(Buffer.concat([bfactHash, bfact_sg, bmemo]))
        );

        return after;
    }
}

module.exports = {
    Generator,
    JSONParser,
    Signer
};