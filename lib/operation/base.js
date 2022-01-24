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

/* SDK module */
const { newFactSign } = require('../sign');
const { _hint, getTimeStamp, sum256, concatObjectsToBuffer } = require('../util');

/* base58 package */
const bs58 = require('bs58');


class Item {
    constructor(type) {
        this.hint = _hint(type);
    }

    buffer() {
        throw '[ERROR] Unimplemented function buffer()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }
}

class OperationFact {

    constructor(type) {
        this.hint = _hint(type);
        this.token = getTimeStamp();
    }

    buffer() {
        throw '[ERROR] Unimplemented function buffer()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }

    _generateHash() {
        this.hash = sum256(this.buffer());
    }
};


class Operation {

    constructor(id, type, memo, fact) {
        this.id = id;
        this.hint = _hint(type);
        this.memo = memo;
        this.fact = fact;
        this.fact_signs = [];
        this.hash = undefined;
    }

    _generateFactSign(sk) {
        return newFactSign(
            Buffer.concat([
                this.fact.hash,
                Buffer.from(this.id)
            ]),
            sk
        );
    }

    _generateHash() {
        this.hash = sum256(this.buffer());
    }

    /**
     * Adds fact_sign to fact_signs.
     * hash will be calculated again after adding fact_sign.
     * @param {string} sk Signing key with type suffix (mpr)
     */
    addSign(sk) {
        this.fact_signs.push(
            this._generateFactSign(sk, this.id)
        );
        this._generateHash();
    }

    buffer() {
        if (this.fact_signs.length < 1) {
            throw '[ERROR] Empty fact sign!'
        }

        const bHash = this.fact.hash;
        const bFactSigns = concatObjectsToBuffer(this.fact_signs)
        const bMemo = Buffer.from(this.memo);

        return Buffer.concat([bHash, bFactSigns, bMemo]);
    }

    /**
     * Returns operation in dictionary type.
     * Each value will be converted into a format suitable for sending the operation to the network.
     * @returns {object} Dictionary object of Operation
     */ 
    dict() {
        const operation = {};
        operation.memo = this.memo;
        operation._hint = this.hint;
        operation.fact = this.fact.dict();
        operation.hash = bs58.encode(this.hash);

        const fact_signs = [];
        for (var i = 0; i < this.fact_signs.length; i++) {
            fact_signs.push(
                this.fact_signs[i].dict()
            );
        }
        operation.fact_signs = fact_signs;

        return operation;
    }
};


class OperationGenerator {

    constructor(id) {
        this.id = id;
    }

    setId(id) {
        this.id = id;
    }

};


module.exports = {
    Item,
    Operation,
    OperationFact,
    OperationGenerator,
};