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

const { Amount } = require('../base');
const { CreateContractAccountsItem } = require('./item');
const { CreateContractAccountsFact } = require('./fact');

// util
const { parseTyped } = require('../../../util');

// generator
const { OperationGenerator } = require('../../base');

// hint
const { MC_EXT_CREATE_CONTRACT_ACCOUNTS_SINGLE_AMOUNT, MC_EXT_CREATE_CONTRACT_ACCOUNTS_MULTIPLE_AMOUNTS, 
    PUBLIC_KEY } = require('../../../hint');

// key
const { Keys, Key } = require('../../../key');


/**
 * @class
 * @extends OperationGenerator
 * CurrencyExtensionGenerator helps to generate data and json files to send to mitum network.
 * Before you use methods of CurrencyExtensionGenerator, network id should be set, first.
 * @property {string} id
 */
class CurrencyExtensionGenerator extends OperationGenerator {

    /**
     * Returns CreateContractAccountsItem by keys and amounts.
     * @param {Keys} keys Keys instance - from Generator.keys
     * @param {object} amounts List of Amount instances - from Generator.amounts
     * @returns {CreateContractAccountsItem} CreateContractAccountsItem
     */
    getCreateContractAccountsItem(keys, amounts) {
        // const _type = amounts.length <= 1 ? MC_EXT_CREATE_CONTRACT_ACCOUNTS_SINGLE_AMOUNT : MC_EXT_CREATE_CONTRACT_ACCOUNTS_MULTIPLE_AMOUNTS;
        const _type = MC_EXT_CREATE_CONTRACT_ACCOUNTS_MULTIPLE_AMOUNTS
        return new CreateContractAccountsItem(
            _type, keys, amounts
        );
    };

    /**
     * Returns CreateContractAccountsFact by sender and CreateContractAccountItems.
     * @param {string} sender Sender address with type suffix (mca) 
     * @param {object} items List of CreateContractAccountsItems
     * @returns {CreateContractAccountsFact} CreateContractAccountsFact
     */
    getCreateContractAccountsFact(sender, items) {
        return new CreateContractAccountsFact(
            sender, items
        );
    };
};


module.exports = {
    CurrencyExtensionGenerator,
};