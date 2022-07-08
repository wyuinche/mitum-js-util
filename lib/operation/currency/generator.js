/*
    mitum-js-util SDK for mitum-currency, mitum-document
    Copyright (C) 2021-2022 ProtoconNet

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

const { Amount } = require('./base');
const { CreateAccountsItem, TransfersItem } = require('./item');
const { CreateAccountsFact, KeyUpdaterFact, TransfersFact } = require('./fact');
const { CurrencyExtensionGenerator } = require("./extension");

// util, error
const { parseTyped } = require('../../util');
const { ValidationError } = require('../../errors');

// generator
const { OperationGenerator } = require('../base');

// hint
const { MC_CREATE_ACCOUNTS_SINGLE_AMOUNT, MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS,
    MC_TRANSFERS_ITEM_SINGLE_AMOUNT, MC_TRANSFERS_ITEM_MULTI_AMOUNTS, PUBLIC_KEY } = require('../../hint');

// key
const { Keys, Key } = require('../../key');


/**
 * @class
 * @extends OperationGenerator
 * CurrencyGenerator supports generating data and json files for the currency model to be sent to the mitum network.
 * You must set the network ID before using the generator method.
 * It helps generate operations for currency and extended models.
 * @property {string} id
 * @property {CurrencyExtensionGenerator} extension
 */
class CurrencyGenerator extends OperationGenerator {


    /**
     * Generator instance with network id.
     * @param {string} id Network ID 
     */
    constructor(id) {
        super(id);
        this.extension = new CurrencyExtensionGenerator(id);
    }

    /**
    * Sets a new network ID.
    * @param {string} id New network ID
    */
    setId(id) {
        this.id = id;
        this.extension.setId(id);
    }

    /**
     * Returns {key, weight} from (key, weight).
     * @param {string} key Public key with suffix (mpu)
     * @param {number} weight Weight of the key
     * @returns {object} Object {key, weight}
     */
    key(key, weight) {
        const parsed = parseTyped(key);

        if (parsed.type !== PUBLIC_KEY) {
            throw new ValidationError(`suffix !== ${PUBLIC_KEY} :: CurrencyGenerator; Invalid key.`);
        }
        if (typeof (weight) !== 'number') {
            throw new TypeError(`typeof weight !== number, now ${typeof (weight)} :: CurrencyGenerator; Invalid weight.`);
        }
        return {
            key: key,
            weight: weight
        };
    }

    /**
     * Returns {big, cid} from (big, cid).
     * @param {string} big Amount of the currency
     * @param {string} cid Currency ID
     * @returns {object} Object {big, cid}
     */
    amount(cid, big) {
        if (cid.length < 1) {
            throw new ValidationError(`currency-length == ${cid.length} :: CurrencyGenerator; empty currency id.`);
        }
        return {
            big: big,
            cid: cid
        }
    }

    /**
     * Returns Keys generated from keys and threshold.
     * @param {object} keys List of {key, weight} generated from Generator.key 
     * @param {number} threshold Threshold
     * @returns {Keys} Keys
     */
    keys(keys, threshold) {
        return new Keys(
            keys.map(x => new Key(x.key, x.weight)),
            threshold,
        );
    };

    /**
     * Returns list of Amount generated from amounts.
     * @param {object} amounts List of Amount created by Generator.amount 
     * @returns {object} List of Amount
     */
    amounts(amounts) {
        return amounts.map(x => new Amount(x.big, x.cid));
    };

    /**
     * Returns CreateAccountsItem generated from keys and amounts.
     * @param {Keys} keys Keys instance created by Generator.keys
     * @param {object} amounts List of Amount created by Generator.amounts
     * @returns {CreateAccountsItem} CreateAccountsItem
     */
    getCreateAccountsItem(keys, amounts) {
        const _type = amounts.length <= 1 ? MC_CREATE_ACCOUNTS_SINGLE_AMOUNT : MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS;
        return new CreateAccountsItem(
            _type, keys, amounts
        );
    };

    /**
     * Returns TransfersItem generated from receiver and amounts.
     * @param {string} receiver Receiver address with suffix (mca)
     * @param {object} amounts List of Amount created by Generator.amounts
     * @returns {TransfersItem} TransfersItem
     */
    getTransfersItem(receiver, amounts) {
        const _type = amounts.length <= 1 ? MC_TRANSFERS_ITEM_SINGLE_AMOUNT : MC_TRANSFERS_ITEM_MULTI_AMOUNTS;
        return new TransfersItem(
            _type, receiver, amounts
        )
    };

    /**
     * Returns CreateAccountsFact generated from sender and items.
     * @param {string} sender Sender address with suffix (mca) 
     * @param {object} items List of CreateAccountsItem
     * @returns {CreateAccountsFact} CreateAccountsFact
     */
    getCreateAccountsFact(sender, items) {
        return new CreateAccountsFact(
            sender, items
        );
    };

    /**
     * Returns KeyUpdaterFact generated from target address, currency id, and keys.
     * @param {string} target Target account address to change keys (mca).
     * @param {string} cid Currency ID
     * @param {Keys} keys New keys of account 
     * @returns {KeyUpdaterFact} KeyUpdaterFact
     */
    getKeyUpdaterFact(target, cid, keys) {
        return new KeyUpdaterFact(
            target, cid, keys
        );
    };

    /**
     * Returns TransfersFact generated from sender and TransfersItems.
     * @param {string} sender Sender address with suffix (mca)
     * @param {object} items List of TransfersItem
     * @returns {TransfersFact} TransfersFact
     */
    getTransfersFact(sender, items) {
        return new TransfersFact(
            sender, items
        )
    };
};


module.exports = {
    CurrencyGenerator,
};