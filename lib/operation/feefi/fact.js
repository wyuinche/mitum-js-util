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

// operation
const { PurposedOperationFact } = require("../base");

// key
const { Address } = require("../../key");

// encode
const bs58 = require('bs58');


class PoolRegisterFact extends PurposedOperationFact {

    constructor(sender, target, initFee, incomeCid, outgoCid, cid) {
        super(MF_POOL_REGISTER_OP_FACT);
        this.sender = new Address(sender);
        this.target = new Address(target);
        this.initFee = initFee;
        this.incomeCid = incomeCid;
        this.outgoCid = outgoCid;
        this.cid = cid;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bTarget = this.target.buffer();
        const bInitFee = this.initFee.buffer();
        const bIncomeCid = Buffer.from(this.incomeCid);
        const bOutGoCid = Buffer.from(this.outgoCid);
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bToken, bSender, bTarget, bInitFee, bIncomeCid, bOutGoCid, bCid]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.target = this.target.typed();
        fact.initialfee = this.initFee.dict();
        fact.incomingcid = this.incomeCid;
        fact.outgoingcid = this.outgoCid;
        fact.currency = this.cid;

        return fact;
    }

    get operationHint() {
        return MF_POOL_REGISTER_OP;
    }
};


class PoolPolicyUpdaterFact extends PurposedOperationFact {

    constructor(sender, target, fee, poolId, cid) {
        super(MF_POOL_POLICY_UPDATER_OP_FACT);
        this.sender = new Address(sender);
        this.target = new Address(target);
        this.fee = fee;
        this.poolId = poolId;
        this.cid = cid;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bTarget = this.target.buffer();
        const bFee = this.fee.buffer();
        const bPoolId = Buffer.from(this.poolId);
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bToken, bSender, bTarget, bFee, bPoolId, bCid]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.target = this.target.typed();
        fact.fee = this.fee.dict();
        fact.poolid = this.poolId;
        fact.currency = this.cid;

        return fact;
    }

    get operationHint() {
        return MF_POOL_POLICY_UPDATER_OP;
    }
};


class PoolDepositsFact extends PurposedOperationFact {

    constructor(sender, pool, poolId, amount) {
        super(MF_POOL_DEPOSITS_OP_FACT)
        this.sender = new Address(sender);
        this.pool = new Address(pool);
        this.poolId = poolId;
        this.amount = amount

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bPool = this.pool.buffer();
        const bPoolId = Buffer.from(this.poolId);
        const bAmount = this.amount.buffer();

        return Buffer.concat([bToken, bSender, bPool, bPoolId, bAmount]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.pool = this.pool.typed();
        fact.poolid = this.poolId;
        fact.amount = this.amount.dict();

        return fact;
    }

    get operationHint() {
        return MF_POOL_DEPOSITS_OP;
    }
}


class PoolWithdrawFact extends PurposedOperationFact {

    constructor(sender, pool, poolId, amounts) {
        super(MF_POOL_WITHDRAW_OP_FACT)
        this.sender = new Address(sender);
        this.pool = new Address(pool);
        this.poolId = poolId;
        this.amounts = amounts

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bPool = this.pool.buffer();
        const bPoolId = Buffer.from(this.poolId);
        const bAmounts = Buffer.concat(this.amounts.map(x => x.buffer()));

        return Buffer.concat([bToken, bSender, bPool, bPoolId, bAmounts]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();
        fact.pool = this.pool.typed();
        fact.poolid = this.poolId;
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