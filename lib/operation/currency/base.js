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

const { _hint, BigInteger } = require('../../util');
const { MC_AMOUNT } = require('../../hint');
const { Key, Keys } = require('../../key');


class Amount {

    constructor(big, cid) {
        if (typeof big !== "string") {
            throw new Error("[ERROR] Invalid amount(big) type for BigInteger! Use string.");
        }

        this.hint = _hint(MC_AMOUNT);
        this.big = new BigInteger(big);
        this.cid = cid;
    }

    buffer() {
        const bBig = this.big.tight();
        const bCid = Buffer.from(this.cid);

        return Buffer.concat([bBig, bCid]);
    }

    dict() {
        const amount = {};
        amount._hint = this.hint;
        amount.amount = this.big.rawValue;
        amount.currency = this.cid;
        return amount;
    }
};


const _toKeys = (ks, threshold) => {
    const _keys = [];

    for (var i = 0; i < ks.length; i++) {
        _keys.push(
            new Key(
                ks[i].key,
                ks[i].weight
            )
        )
    }

    const keys = new Keys(
        _keys,
        threshold,
    );

    return keys;
};

const _toAmounts = (amounts) => {
    const _amounts = [];

    for (var i = 0; i < amounts.length; i++) {
        _amounts.push(
            new Amount(
                amounts[i].big,
                amounts[i].cid
            )
        );
    }

    return _amounts;
};


module.exports = {
    Amount,
    _toKeys,
    _toAmounts,
};