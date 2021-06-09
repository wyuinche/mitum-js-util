const Xsign = require('./sign');
const Xutil = require('./util');
const Xhint = require('./hint');

const bs58 = require('bs58');


class Amount {
    constructor(big, cid) {
        this.hint = Xutil._hint(Xhint.MC_AMOUNT);
        this.big = new Xutil.BigInteger(big);
        this.cid = cid;
    }

    buffer() {
        const bbig = this.big.buffer();
        const bcid = Buffer.from(this.cid);

        return Buffer.concat([bbig, bcid]);
    }

    dict() {
        const amount = {};
        amount._hint = this.hint;
        amount.amount = this.big.value.toString();
        amount.currency = this.cid;
        return amount;
    }
};

class Address {
    constructor(addr) {
        let parsed = Xutil.parseHinted(addr);
        
        this.hint = parsed.hint;
        this.addr = parsed.hintless;
    }

    buffer() {
        return Buffer.from(this.addr + ':' + this.hint);
    }

    hinted() {
        return this.addr + ':' + this.hint;
    }
};

class Item {
    constructor(type, amounts) {
        this.hint = Xutil._hint(type);
        this.amounts = amounts;
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
        const bkeys = this.keys.buffer();
        const bamounts = Xutil.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bkeys, bamounts]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.keys = this.keys.dict();

        const amounts = [];
        for(var i = 0; i < this.amounts.length; i++) {
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
        const breceiver = this.receiver.buffer();
        const bamounts = Xutil.concatObjectsToBuffer(this.amounts);

        return Buffer.concat([breceiver, bamounts]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.receiver = this.receiver.hinted();

        const amounts = [];
        for(var i = 0; i < this.amounts.length; i++){
            amounts.push(
                this.amounts[i].dict()
            );
        }
        item.amounts = amounts;
        return item;
    }
};

class OperationFact {
    constructor(type) {
        this.hint = Xutil._hint(type);
        this.token = Xutil.getTimeStamp();
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }

    _generateHash() {
        this.hash = Xutil.sum256(this.buffer());
    }
};

class CreateAccountsFact extends OperationFact {
    constructor(sender, items) {
        super(
            Xhint.MC_CREATE_ACCOUNTS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const btoken = Buffer.from(Xutil.dateToUTC(this.token));
        const bsender = this.sender.buffer();
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
        for(var i = 0; i < this.items.length; i++) {
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
            Xhint.MC_KEYUPDATER_OP_FACT
        );
        this.target = new Address(target);
        this.cid = cid;
        this.keys = keys;

        this._generateHash();
    }

    buffer() {
        const btoken = Buffer.from(Xutil.dateToUTC(this.token));
        const btarget = this.target.buffer();
        const bkeys = this.keys.buffer();
        const bcid = Buffer.from(this.cid);
        
        return Buffer.concat([btoken, btarget, bkeys, bcid]);
    }

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

class TransfersFact extends OperationFact {
    constructor(sender, items) {
        super(
            Xhint.MC_TRANSFERS_OP_FACT
        );
        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const btoken = Buffer.from(Xutil.dateToUTC(this.token));
        const bsender = this.sender.buffer();
        const bitems = Xutil.concatObjectsToBuffer(items);

        return Buffer.concat([btoken, bsender, bitems]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.hinted();

        const items = [];
        for(var i = 0; i < this.items.length; i++) {
            items.push(
                this.items[i].dict()
            );
        }
        fact.items = items;

        return fact;
    }
};

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
        return Xsign.newFactSign(
            Buffer.concat([
                this.fact.hash,
                Buffer.from(this.netID)
            ]),
            sk
        );
    }

    _generateHash() {
        this.hash = Xutil.sum256(this.buffer());   
    }

    addSign(sk) {
        this.fact_signs.push(
            this._generateFactSign(sk, this.netID)
        );
        this._generateHash();
    }

    buffer() {
        const bhash = this.fact.hash;
        
        let bfact_sg = Buffer.from('');
        for(var i = 0; i < this.fact_signs.length; i++) {
            bfact_sg = Buffer.concat(
                [bfact_sg, this.fact_signs[i].buffer()]
            );
        }

        const bmemo = Buffer.from(this.memo);
        
        return Buffer.concat([bhash, bfact_sg, bmemo]);
    }

    dict() {
        const oper = {};
        oper.memo = this.memo;
        oper._hint = this.hint;
        oper.fact = this.fact.dict();
        oper.hash = bs58.encode(this.hash);

        const fact_signs = [];
        for(var i = 0; i < this.fact_signs.length; i++){
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
    CreateAccountsFact,
    KeyUpdaterFact,
    TransfersFact,
    Operation,
};