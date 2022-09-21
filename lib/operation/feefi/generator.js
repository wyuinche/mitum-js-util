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

const { PoolRegisterFact, PoolPolicyUpdaterFact, PoolDepositsFact, PoolWithdrawFact } = require("./fact");

// generator
const { OperationGenerator } = require("../base");

// currency
const { Amount } = require("../currency");


/**
 * @class
 * @extends OperationGenerator
 * FeeFiGenerator supports generating data and json files for the feefi model to be sent to the mitum network.
 * You must set the network ID before using the generator method.
 * @property {string} id
 */
class FeeFiGenerator extends OperationGenerator {

    /**
     * Returns PoolRegisterFact generated from sender, target, initial fee, incoming currency id, outlay currency id, and currency id.
     * @param {string} sender Sender
     * @param {string} target Target
     * @param {string} initFee Initial Fee
     * @param {string} incomeCid Incoming Currency ID
     * @param {string} outlayCid Outlay Currency ID
     * @param {string} cid currencyID
     * @returns {PoolRegisterFact} PoolRegisterFact
     */
    getPoolRegisterFact(sender, target, initFee, incomeCid, outlayCid, cid) {
        return new PoolRegisterFact(sender, target, initFee, incomeCid, outlayCid, cid);
    }

    /**
     * Returns PoolPolicyUpdaterFact generated from sender, target, fee, incoming currency id, outlay currency id, and currency id.
     * @param {string} sender Sender
     * @param {string} target Target
     * @param {string} fee Fee
     * @param {string} incomeCid Incoming Currency ID
     * @param {string} outlayCid Outlay Currency ID
     * @param {string} cid currencyID
     * @returns {PoolPolicyUpdaterFact} PoolPolicyUpdaterFact
     */
    getPoolPolicyUpdaterFact(sender, target, fee, incomeCid, outlayCid, cid) {
        return new PoolPolicyUpdaterFact(sender, target, fee, incomeCid, outlayCid, cid);
    }

    /**
     * Returns PoolDepositsFact generated from sender, pool, incoming currency id, outlay currency id, and amount.
     * @param {string} sender Sender
     * @param {string} pool Pool
     * @param {string} incomeCid Incoming Currency ID
     * @param {string} outlayCid Outlay Currency ID
     * @param {string} amount Amount
     * @returns {PoolDepositsFact} PoolDepositsFact
     */
    getPoolDepositsFact(sender, pool, incomeCid, outlayCid, amount) {
        return new PoolDepositsFact(sender, pool, incomeCid, outlayCid, amount);
    }

    /**
     * Returns PoolWithdrawFact generated from sender, pool, incoming currency id, outlay currency id, and amounts.
     * @param {string} sender Sender
     * @param {string} pool Pool
     * @param {string} incomeCid Incoming Currency ID
     * @param {string} outlayCid Outlay Currency ID
     * @param {object} amounts Amounts
     * @returns {PoolWithdrawFact} PoolWithdrawFact
     */
    getPoolWithdrawFact(sender, pool, incomeCid, outlayCid, amounts) {
        return new PoolWithdrawFact(sender, pool, incomeCid, outlayCid, amounts);
    }
};


module.exports = {
    FeeFiGenerator,
};