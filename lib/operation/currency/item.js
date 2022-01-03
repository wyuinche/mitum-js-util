/*
    mitum-js-util SDK for mitum-currency and mitum-data-blocksign
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

const { Item } = require('./base');
const { Address } = require('../../key');
const { concatObjectsToBuffer } = require('../../util');


class CreateAccountsItem extends Item {

    constructor(type, keys, amounts) {
        super(type, amounts);
        this.keys = keys;
    }

    buffer() {
        const bKeys = this.keys.buffer();
        const bAmounts = concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bKeys, bAmounts]);
    }

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


class TransfersItem extends Item {

    constructor(type, receiver, amounts) {
        super(type, amounts);
        this.receiver = new Address(receiver);
    }

    buffer() {
        const bReceiver = this.receiver.buffer();
        const bAmounts = concatObjectsToBuffer(this.amounts);

        return Buffer.concat([bReceiver, bAmounts]);
    }

    dict() {
        const item = {};
        item._hint = this.hint;
        item.receiver = this.receiver.typed();

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


module.exports = {
    CreateAccountsItem,
    TransfersItem,
};