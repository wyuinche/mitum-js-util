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
const { MF_POOL_REGISTER_OP_FACT, MF_POOL_REGISTER_OP,
    MF_POOL_POLICY_UPDATER_OP_FACT, MF_POOL_POLICY_UPDATER_OP, MF_POOL_DEPOSITS_OP_FACT, MF_POOL_WITHDRAW_OP_FACT, MF_POOL_DEPOSITS_OP, MF_POOL_WITHDRAW_OP } = require("../../hint");

// util
const { BigInteger } = require("../../util");

// operation
const { PurposedOperationFact } = require("../base");

// key
const { Address } = require("../../key");

// encode
const bs58 = require('bs58');


class PoolRegisterFact extends PurposedOperationFact {
    constructor(sender, target, initFee, incomeCid, outlayCid, cid) {
        super(MF_POOL_REGISTER_OP_FACT);
        this.sender = new Address(sender);
        this.target = new Address(target);
        this.initFee = new BigInteger(initFee);
        this.incomeCid = incomeCid;
        this.outlayCid = outlayCid;
        this.cid = cid;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bTarget = this.target.buffer();
        const bInitFee = this.initFee.tight();
        const bIncomeCid = Buffer.from(this.incomeCid);
        const bOutlayCid = Buffer.from(this.outlayCid);
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bToken, bSender, bTarget, bInitFee, bIncomeCid, bOutlayCid, bCid]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.target = this.target.typed();
        fact.initialfee = this.initFee.rawValue;
        fact.incomecid = this.incomeCid;
        fact.outlaycid = this.outlayCid;
        fact.currency = this.cid;

        return fact;
    }

    get operationHint() {
        return MF_POOL_REGISTER_OP;
    }
};


class PoolPolicyUpdaterFact extends PurposedOperationFact {
    constructor(sender, target, fee, incomeCid, outlayCid, cid) {
        super(MF_POOL_POLICY_UPDATER_OP_FACT);
        this.sender = new Address(sender);
        this.target = new Address(target);
        this.fee = new BigInteger(fee);
        this.incomeCid = incomeCid;
        this.outlayCid = outlayCid;
        this.cid = cid;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bTarget = this.target.buffer();
        const bFee = this.fee.tight();
        const bIncomeCid = Buffer.from(this.incomeCid);
        const bOutlayCid = Buffer.from(this.outlayCid);
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bToken, bSender, bTarget, bFee, bIncomeCid, bOutlayCid, bCid]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.target = this.target.typed();
        fact.fee = this.fee.rawValue;
        fact.incomecid = this.incomeCid;
        fact.outlaycid = this.outlayCid;
        fact.currency = this.cid;

        return fact;
    }

    get operationHint() {
        return MF_POOL_POLICY_UPDATER_OP;
    }
};


class PoolDepositsFact extends PurposedOperationFact {
    constructor(sender, pool, incomeCid, outlayCid, amount) {
        super(MF_POOL_DEPOSITS_OP_FACT)
        this.sender = new Address(sender);
        this.pool = new Address(pool);
        this.incomeCid = incomeCid;
        this.outlayCid = outlayCid;
        this.amount = new BigInteger(amount)

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bPool = this.pool.buffer();
        const bIncomeCid = Buffer.from(this.incomeCid);
        const bOutlayCid = Buffer.from(this.outlayCid);
        const bAmount = this.amount.tight();

        return Buffer.concat([bToken, bSender, bPool, bIncomeCid, bOutlayCid, bAmount]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.pool = this.pool.typed();
        fact.incomecid = this.incomeCid;
        fact.outlaycid = this.outlayCid;
        fact.amount = this.amount.rawValue;

        return fact;
    }

    get operationHint() {
        return MF_POOL_DEPOSITS_OP;
    }
}


class PoolWithdrawFact extends PurposedOperationFact {
    constructor(sender, pool, incomeCid, outlayCid, amounts) {
        super(MF_POOL_WITHDRAW_OP_FACT)
        this.sender = new Address(sender);
        this.pool = new Address(pool);
        this.incomeCid = incomeCid;
        this.outlayCid = outlayCid;
        this.amounts = amounts

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bPool = this.pool.buffer();
        const bIncomeCid = Buffer.from(this.incomeCid);
        const bOutlayCid = Buffer.from(this.outlayCid);
        const bAmounts = Buffer.concat(this.amounts.map(x => x.buffer()));

        return Buffer.concat([bToken, bSender, bPool, bIncomeCid, bOutlayCid, bAmounts]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.pool = this.pool.typed();
        fact.incomecid = this.incomeCid;
        fact.outlaycid = this.outlayCid;
        fact.amounts = this.amounts.map(x => x.dict());

        return fact;
    }

    get operationHint() {
        return MF_POOL_WITHDRAW_OP;
    }
}


module.exports = {
    PoolRegisterFact,
    PoolPolicyUpdaterFact,
    PoolDepositsFact,
    PoolWithdrawFact,
};