const sign = require('./sign');
const util = require('./util');
const hint = require('./hint');


class Amount {
    constructor(big, cid) {
        this.hint = util._hint(hint.MC_AMOUNT);
        this.big = new util.BigInteger(big);
        this.cid = cid;
    }

    buffer() {
        const bbig = this.big.buffer();
        const bcid = Buffer.from(this.cid);

        return Buffer.concat([bbig, bcid]);
    }
};

class Address {
    constructor(addr) {
        let parsed = util.parseHinted(addr);
        
        this.hint = parsed.hint;
        this.addr = parsed.hintless;
    }

    buffer() {
        return Buffer.from(this.addr + '-' + this.hint);
    }
};

class Item {
    constructor(type, amounts) {
        this.hint = util._hint(type);
        this.amounts = amounts;
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }
};

class CreateAccountsItem extends Item {
    constructor(type, keys, amounts) {
        super(type, amounts);
        this.keys = keys;
    }

    buffer() {
        const bkeys = this.keys.buffer();
        const bamounts = util.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bkeys, bamounts]);
    }
};

class TransfersItem extends Item {
    constructor(type, receiver, amounts) {
        super(type, amounts);
        this.receiver = new Address(receiver);
    }

    buffer() {
        const breceiver = this.receiver.buffer();
        const bamounts = util.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([breceiver, bamounts]);
    }
};

class OperationFact {
    constructor(type) {
        this.hint = util._hint(type);
        this.token = util.getTimeStamp();
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    _generateHash() {
        this.hash = util.sum256(this.buffer());
    }
};

class CreateAccountsFact extends OperationFact {
    constructor(sender, items) {
        super(
            hint.MC_CREATE_ACCOUNTS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const btoken = Buffer.from(util.dateToUTC(this.token));
        const bsender = this.sender.buffer();
        const bitems = util.concatObjectsToBuffer(this.items);

        return Buffer.concat([btoken, bsender, bitems]);
    }
};

class KeyUpdaterFact extends OperationFact {
    constructor(target, cid, keys) {      
        super(
            hint.MC_KEYUPDATER_OP_FACT
        );
        this.target = new Address(target);
        this.cid = cid;
        this.keys = keys;

        this._generateHash();
    }

    buffer() {
        const btoken = Buffer.from(util.dateToUTC(this.token));
        const btarget = this.target.buffer();
        const bkeys = this.keys.buffer();
        const bcid = Buffer.from(this.cid);
        
        return Buffer.concat([btoken, btarget, bkeys, bcid]);
    }
};

class TransfersFact extends OperationFact {
    constructor(sender, items) {
        super(
            hint.MC_TRANSFERS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const btoken = Buffer.from(util.dateToUTC(this.token));
        const bsender = this.sender.buffer();
        const bitems = util.concatObjectsToBuffer(items);

        return Buffer.concat([btoken, bsender, bitems]);
    }
};

class Operation {
    constructor(type, memo, fact) {
        this.hint = util._hint(type);
        this.memo = memo;
        this.fact = fact;

        this._generateFactSign();
        this._generateHash();
    }

    _generateFactSign(sk, netID) {
        this.fact_sign = sign.newFactSign(
            Buffer.concat([
                this.fact.hash.digest(),
                Buffer.from(netID)
            ]),
            sk
        );
    }

    _generateHash() {
        this.hash = util.sum256(this.buffer());   
    }

    buffer() {
        const bhash = this.fact.hash.digest();
        const bfact_sg = this.fact_sign.buffer();
        const bmemo = Buffer.from(this.memo);
        
        return Buffer.concat([bhash, bfact_sg, bmemo]);
    }
};

module.exports = {
    Amount,
    Address,
    CreateAccountsItem,
    TransfersItem,
    CreateAccountsFact,
    KeyUpdaterFact,
    TransfersFact,
    Operation,
};