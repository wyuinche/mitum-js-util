/*
    mitum-js-util SDK for mitum-currency, mitum-data-blocksign and mitum-blockcity
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

const { OperationFact } = require('../base');
const { Address } = require('../../key');
const { concatObjectsToBuffer } = require('../../util');

const bs58 = require('bs58');


class BlockSignFact extends OperationFact {
    
    constructor(type, sender, items) {
        super(type);
        this.sender = new Address(sender);
        this.items = items;
        this.type = type;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bItems = concatObjectsToBuffer(this.items);

        return Buffer.concat([bToken, bSender, bItems]);
    }

    dict() {
        const fact = {};
        fact._hint = this.hint;
        fact.hash = bs58.encode(this.hash);
        fact.token = Buffer.from(this.token.toISOString(), 'utf8').toString('base64');
        fact.sender = this.sender.typed();

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


module.exports = {
    BlockSignFact,
};