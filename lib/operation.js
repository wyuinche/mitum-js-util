/* SDK module */
const Xsign = require('./sign');
const Xutil = require('./util');
const Xhint = require('./hint');
const Xkey = require('./key');

/* base58 package */
const bs58 = require('bs58');


/**
 * @class
 * Amount with specific currency.
 * @property {string} hint - 'MC_AMOUNT-[version]'
 * @property {Xutil.BigInteger} big - Target amount
 * @property {string} cid - Currency ID
 */
class Amount {
    /** 
     * @constructor
     * @param {number} big - Target amount
     * @param {string} cid - Currenct ID
    */
    constructor(big, cid) {
        this.hint = Xutil._hint(Xhint.MC_AMOUNT);
        this.big = new Xutil.BigInteger(big);
        this.cid = cid;
    }

    /**
     * @method
     * Concatenates every big.tight() and cid Buffer then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: big.tight()~cid-Buffer
     */
    buffer() {
        const bbig = this.big.tight();
        const bcid = Buffer.from(this.cid);

        return Buffer.concat([bbig, bcid]);
    }

    /**
     * @method
     * Returns amount dictionary.
     * @return {object} - Dictionary object: {_hint, hash, threshold}
     */
    dict() {
        const amount = {};
        amount._hint = this.hint;
        amount.amount = this.big.value.toString();
        amount.currency = this.cid;
        return amount;
    }
};


/**
 * @class
 * Account address.
 * @property {string} hint - 'mca-[version]'
 * @property {string} addr - Hintless address
 */
class Address {
    /**
     * @constructor
     * @param {string} addr - Hinted address
     */
    constructor(addr) {
        let parsed = Xutil.parseHinted(addr);

        this.hint = parsed.hint;
        this.addr = parsed.hintless;
    }

    /**
     * @method
     * Returns Buffer of hintless address.
     * @return {Buffer} - Buffered hintless address 
     */
    buffer() {
        return Buffer.from(this.addr);
    }

    /**
     * @method
     * Returns hinted address.
     * @return {string} - Hinted address
     */
    hinted() {
        return this.addr + ':' + this.hint;
    }
};


/**
 * @class
 * Item containing item type and amount list.
 * CreateAccountsItem and TransfersItem extend this class.
 * type: [ MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS | MC_CREATE_ACCOUNTS_SINGLE_AMOUNT | MC_TRANSFERS_ITEM_MULTI_AMOUNTS | MC_TRANSFERS_ITEM_SINGLE_AMOUNT ]
 * @property {string} hint - '[type]-[version]' 
 * @property {object} amounts - Array that each element is amount # amount:{big, cid}
*/
class Item {
    /**
     * @constructor
     * type: [ MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS | MC_CREATE_ACCOUNTS_SINGLE_AMOUNT | MC_TRANSFERS_ITEM_MULTI_AMOUNTS | MC_TRANSFERS_ITEM_SINGLE_AMOUNT ]
     * @param {string} type - [type]
     * @param {object} amounts - Array that each element is amount # amount:{big, cid}
    */
    constructor(type, amounts) {
        this.hint = Xutil._hint(type);
        this.amounts = amounts;
    }

    /**
     * @abstract
     * Returns Buffer for Item.
     * @return {Buffer} - Concatenated Buffer
     */
    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    /**
     * @abstract
     * Returns item dictionary.
     * @return {object} - Dictionary object: {_hint, ...}
     */
    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }
};

class BlockSignItem {

    constructor(type) {
        this.hint = Xutil._hint(type);
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }
};


/**
 * @class
 * @extends Item
 * Item for Create-Accounts operation.
 * @property {string} hint - '[ MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS | MC_CREATE_ACCOUNTS_SINGLE_AMOUNT ]-[version]'
 * @property {Xkey.Keys} keys - Keys object consists of target keys
 * @property {object} amounts - Array that each element is amount # amount:{big, cid}
 */
class CreateAccountsItem extends Item {
    /**
     * @constructor
     * @param {string} type - [ MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS | MC_CREATE_ACCOUNTS_SINGLE_AMOUNT ]
     * @param {Xkey.Keys} keys - Key object consists of target keys
     * @param {object} amounts - Array that each element is amount # amount:{big, cid}
     */
    constructor(type, keys, amounts) {
        super(type, amounts);
        this.keys = keys;
    }

    /**
     * @override
     * Concatenates keys.buffer() and every amount.buffer() in amounts list then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: keys.buffer()~*amount.buffer()
     */
    buffer() {
        const bkeys = this.keys.buffer();
        const bamounts = Xutil.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bkeys, bamounts]);
    }

    /**
     * @override
     * Returns Create-Accounts item dictionary.
     * @return {object} - Dictionary object: {_hint, keys, amounts}
     */
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


/**
 * @class
 * @extends Item
 * Item for Transfers operation.
 * @property {string} hint - '[ MC_TRANSFERS_ITEM_MULTI_AMOUNTS | MC_TRANSFERS_ITEM_SINGLE_AMOUNT ]-[version]'
 * @property {Address} receiver - Hinted receiver address
 * @property {object} amounts - Array that each is amount # amount:{big, cid}
 */
class TransfersItem extends Item {
    constructor(type, receiver, amounts) {
        super(type, amounts);
        this.receiver = new Address(receiver);
    }

    /**
     * @override
     * Concatenates hinted-receiver-Buffer and every amount.buffer() in amounts list then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: hinted-receiver-Buffer~*amount.buffer()
     */
    buffer() {
        const breceiver = Buffer.from(this.receiver.hinted());
        const bamounts = Xutil.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([breceiver, bamounts]);
    }

    /**
     * @override
     * Returns Transfers item dictionary.
     * @return {object} - Dictionary object: {_hint, receiver, amounts}
     */
    dict() {
        const item = {};
        item._hint = this.hint;
        item.receiver = this.receiver.hinted();

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
        this.did = new Xutil.BigInteger(did);
        this.signcode = signcode;
        this.title = title;
        this.size = new Xutil.BigInteger(size);
        this.cid = cid;
        this.signers = signers;
        this.signcodes = signcodes;
    }

    buffer() {
        const bfh = Buffer.from(this.fileHash);
        const bdid = this.did.tight();
        const bscode = Buffer.from(this.signcode);
        const btitle = Buffer.from(this.title);
        const bsize = this.size.tight();
        const bcid = Buffer.from(this.cid);

        let bsigners = Buffer.alloc(0);
        for(let i = 0; i < this.signers.length; i++) {
            bsigners = Buffer.concat([bsigners, Buffer.from(this.signers[i])]);
        }

        let bscodes = Buffer.alloc(0);
        for(let i = 0; i < this.signcodes.length; i++) {
            bscodes = Buffer.concat([bscodes, Buffer.from(this.signcodes[i])]);
        }

        return Buffer.concat([bfh, bdid, bscode, btitle, bsize, bcid, bsigners, bscodes]);
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
        this.did = new Xutil.BigInteger(did);
        this.cid = cid;
    }

    buffer() {
        const bdid = this.did.tight();
        const bowner = Buffer.from(this.owner.hinted());
        const bcid = Buffer.from(this.cid);
        return Buffer.concat([bdid, bowner, bcid]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.documentid = "" + this.did.value;
        item.owner = this.owner.hinted();
        item.currency = this.cid;
        return item;
    }
}

class TransferDocumentsItem extends BlockSignItem {
    constructor(type, owner, receiver, did, cid) {
        super(type);
        this.owner = new Address(owner);
        this.receiver = new Address(receiver);
        this.did = new Xutil.BigInteger(did);
        this.cid = cid;
    }

    buffer() {
        const bdid = this.did.tight();
        const bowner = Buffer.from(this.owner.hinted());
        const breceiver = Buffer.from(this.receiver.hinted());
        const bcid = Buffer.from(this.cid);
        return Buffer.concat([bdid, bowner, breceiver, bcid]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.documentid = "" + this.did.value;
        item.owner = this.owner.hinted();
        item.receiver = this.receiver.hinted();
        item.currency = this.cid;
        return item;
    }
}

/**
 * @class
 * Operation Fact.
 * CreateAccountsFact, KeyUpdaterFact, and TransfersFact extends this class.
 * @property {string} hint - '[ MC_CREATE_ACCOUNTS_OP_FACT | MC_KEYUPDATER_OP_FACT | MC_TRANSFERS_OP_FACT ]-[version]'
 * @property {Date} token - token for fact
 */
class OperationFact {
    /**
     * @constructor
     * @param {string} type - [ MC_CREATE_ACCOUNTS_OP_FACT | MC_KEYUPDATER_OP_FACT | MC_TRANSFERS_OP_FACT ]
     */
    constructor(type) {
        this.hint = Xutil._hint(type);
        this.token = Xutil.getTimeStamp();
    }

    /**
     * @abstract
     * Returns Buffer of fact.
     * @return {Buffer} - Concatenated Buffer
     */
    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    /**
     * @abstract
     * Returns fact dictionary.
     * @return {object} - Dictionary object: {_hint, hash, token, ...}
     */
    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }

    /**
     * @method
     * Generates fact hash.
     */
    _generateHash() {
        this.hash = Xutil.sum256(this.buffer());
    }
};


/**
 * @class
 * @extends OperationFact
 * Fact of Create-Accounts operation.
 * @property {string} hint - 'MC_CREATE_ACCOUNTS_OP_FACT-[version]'
 * @property {Date} token - token for fact
 * @property {Address} sender - Sender address
 * @property {object} items - Array that each element is CreateAccountsItem
 */
class CreateAccountsFact extends OperationFact {
    /**
     * @constructor
     * @param {string} sender - Hinted sender address
     * @param {object} items - Array that each element is CreateAccountsItem
     */
    constructor(sender, items) {
        super(
            Xhint.MC_CREATE_ACCOUNTS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }


    /**
     * @override
     * Concatenates ISO-format-token-Buffer, hinted-sender-Buffer, and every item in items list then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: ISO-token-Buffer~hinted-sender-Buffer~*item.buffer()
     */
    buffer() {
        const btoken = Buffer.from(this.token.toISOString());
        const bsender = Buffer.from(this.sender.hinted());
        const bitems = Xutil.concatObjectsToBuffer(this.items);

        return Buffer.concat([btoken, bsender, bitems]);
    }

    /**
     * @override
     * Returns fact dictionary.
     * @return {object} - Dictionary object: {_hint, hash, token, sender, items}
     */
    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.hinted();

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


/**
 * @class
 * @extends OperationFact
 * Fact of Key-Updater operation.
 * @property {string} hint - 'MC_KEYUPDATER_OP_FACT-[version]'
 * @property {Date} token - token for fact
 * @property {Address} target - Target address
 * @property {string} cid - CurrencyID
 * @property {Xkey.Keys} keys - Keys object for target keys
 */
class KeyUpdaterFact extends OperationFact {
    /**
     * @operation
     * @param {string} target - Hinted target address
     * @param {string} cid - CurrencyID
     * @param {Xkey.Keys} keys - Keys object for target keys
     */
    constructor(target, cid, keys) {
        super(
            Xhint.MC_KEYUPDATER_OP_FACT
        );
        this.target = new Address(target);
        this.cid = cid;
        this.keys = keys;

        this._generateHash();
    }

    /**
     * @override
     * Concatenates ISO-format-token-Buffer, hinted-target-Buffer, keys.buffer(), and cid-Buffer then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: ISO-token-Buffer~hinted-target-Buffer~keys.buffer()~cid-Buffer
     */
    buffer() {
        const btoken = Buffer.from(this.token.toISOString());
        const btarget = Buffer.from(this.target.hinted());
        const bkeys = this.keys.buffer();
        const bcid = Buffer.from(this.cid);

        return Buffer.concat([btoken, btarget, bkeys, bcid]);
    }

    /**
     * @override
     * Returns fact dictionary.
     * @return {object} - Dictionary object: {_hint, hash, token, target, keys, currency}
     */
    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.target = this.target.hinted();
        fact.keys = this.keys.dict();
        fact.currency = this.cid;
        return fact;
    }
};


/**
 * @class
 * @extends OperationFact
 * Fact of Transfers operation.
 * @property {string} hint - 'MC_TRANSFERS_OP_FACT-[version]'
 * @property {Date} token - token for fact
 * @property {Address} sender - Sender address
 * @property {object} items - Array that each element is TransfersItem
 */
class TransfersFact extends OperationFact {
    /**
     * @constructor
     * @param {string} sender - Hinted sender address
     * @param {object} items - Array that each element is TransfersItem
     */
    constructor(sender, items) {
        super(
            Xhint.MC_TRANSFERS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    /**
     * @override
     * Concatenates ISO-format-token-Buffer, hinted-sender-Buffer, and every item in items list then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: ISO-token-Buffer~hinted-sender-Buffer~*item.buffer()
     */
    buffer() {
        const btoken = Buffer.from(this.token.toISOString());
        const bsender = Buffer.from(this.sender.hinted());
        const bitems = Xutil.concatObjectsToBuffer(this.items);

        return Buffer.concat([btoken, bsender, bitems]);
    }


    /**
     * @override
     * Returns fact dictionary.
     * @return {object} - Dictionary object: {_hint, hash, token, sender, items}
     */
    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.hinted();

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
        const btoken = Buffer.from(this.token.toISOString());
        const bsender = Buffer.from(this.sender.hinted());
        const bitems = Xutil.concatObjectsToBuffer(this.items);

        return Buffer.concat([btoken, bsender, bitems]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.hinted();

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

/**
 * @class
 * Operation for Create-Accounts, Key-Updater and Transfers.
 * @property {string} netID - Network ID
 * @property {string} hint - '[ MC_CREATE_ACCOUNTS_OP | MC_CREATE_KEYUPDATER_OP | MC_TRANSFERS_OP ]-[version]'
 * @property {string} memo - Operation memo
 * @property {OperationFact} fact - [ CreateAccountsFact | KeyUpdaterFact | TransfersFact ]
 * @property {object} fact_signs - Fact signatures # Array that each element is FactSign
 * @property {Buffer} hash - Operation hash
 */
class Operation {
    /**
     * @constructor
     * @param {string} netID - Network ID
     * @param {string} type - [ MC_CREATE_ACCOUNTS_OP | MC_CREATE_KEYUPDATER_OP | MC_TRANSFERS_OP ]
     * @param {string} memo - Operation memo
     * @param {OperationFact} fact - [ CreateAccountsFact | KeyUpdaterFact | TransfersFact ]
     */
    constructor(netID, type, memo, fact) {
        this.netID = netID;
        this.hint = Xutil._hint(type);
        this.memo = memo;
        this.fact = fact;
        this.fact_signs = [];
        this.hash = undefined;
    }

    /**
     * @method
     * Generate new fact signature.
     * @param {string} sk - Hinted signing key
     * @return {Xsign.FactSign} - Generated fact signature
     */
    _generateFactSign(sk) {
        return Xsign.newFactSign(
            Buffer.concat([
                this.fact.hash,
                Buffer.from(this.netID)
            ]),
            sk
        );
    }

    /**
     * @method
     * Generate operation hash.
     * @return {Buffer} - Buffered operation hash
     */
    _generateHash() {
        this.hash = Xutil.sum256(this.buffer());
    }

    /**
     * @method
     * Add new fact signature to fact_signs, and re-generate operation hash.
     * @param {string} sk - Hinted signing key
     */
    addSign(sk) {
        this.fact_signs.push(
            this._generateFactSign(sk, this.netID)
        );
        this._generateHash();
    }

    /**
     * @method
     * Concatenates hash-Buffer, every fact_sign.buffer() in fact_signs, and memo-Buffer then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: hash-Buffer~*fact_sign.buffer()~memo-Buffer
     */
    buffer() {
        if (this.fact_signs.length < 1) {
            throw '[ERROR] Empty fact sign!'
        }
        
        const bhash = this.fact.hash;
        const bfact_sg = Xutil.concatObjectsToBuffer(this.fact_signs)
        const bmemo = Buffer.from(this.memo);

        return Buffer.concat([bhash, bfact_sg, bmemo]);
    }

    /**
     * @override
     * Returns operation dictionary.
     * @return {object} - Dictionary object: {_hint, memo, fact, hash, fact_signs}
     */
    dict() {
        const oper = {};
        oper.memo = this.memo;
        oper._hint = this.hint;
        oper.fact = this.fact.dict();
        oper.hash = bs58.encode(this.hash);

        const fact_signs = [];
        for (var i = 0; i < this.fact_signs.length; i++) {
            fact_signs.push(
                this.fact_signs[i].dict()
            );
        }
        oper.fact_signs = fact_signs;

        return oper;
    }
};

module.exports = {
    Amount,
    Address,
    CreateAccountsItem,
    TransfersItem,
    CreateDocumentsItem,
    SignDocumentsItem,
    TransferDocumentsItem,
    CreateAccountsFact,
    KeyUpdaterFact,
    TransfersFact,
    BlockSignFact,
    Operation,
};
