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
const { 
    MC_EXT_CREATE_CONTRACT_ACCOUNTS_OP_FACT,
    MC_EXT_CREATE_CONTRACT_ACCOUNTS_OP,
    MC_EXT_WITHDRAWS_OP_FACT,
    MC_EXT_WITHDRAWS_OP,
} = require('../../../hint');

// operation
const { GeneralOperationFact } = require('../../base');


class CreateContractAccountsFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MC_EXT_CREATE_CONTRACT_ACCOUNTS_OP_FACT, sender, items);
    }

    get operationHint() {
        return MC_EXT_CREATE_CONTRACT_ACCOUNTS_OP;
    }
};

class WithdrawsFact extends GeneralOperationFact {
    constructor(sender, items) {
        super(MC_EXT_WITHDRAWS_OP_FACT, sender, items);
    }

    get operationHint() {
        return MC_EXT_WITHDRAWS_OP;
    }
};

module.exports = {
    CreateContractAccountsFact,
    WithdrawsFact,
};