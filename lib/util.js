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

const { Uint64BE } = require('int64-buffer');
const bigInt = require('big-integer');

// errors
const { ValidationError } = require('./errors');

// hint
const { VERSION } = require('./constant');
const { MC_ADDRESS, PRIVATE_KEY, PUBLIC_KEY,
    MBC_USER_DATA, MBC_LAND_DATA, MBC_VOTE_DATA, MBC_HISTORY_DATA, MBS_DOCUMENT_DATA } = require('./hint');

// crypto
const crypto = require('crypto');
const jsSHA3 = require('js-sha3');


class BigInteger {

    constructor(big) {
        if (typeof big !== "string") {
            throw new TypeError(`typeof big !== string, now ${typeof big} :: String type only.`);
        }
        this.origin = big;
        this.big = bigInt(big);
    }

    get value() {
        return this.big.valueOf();
    }

    get rawValue() {
        return this.origin;
    }

    byteSize() {
        const bitLen = bigInt(this.value).bitLength();
        const quotient = bigInt(bitLen).divide(8);

        if (bitLen - quotient.valueOf() * 8 > 0) {
            return quotient.valueOf() + 1;
        }
        else {
            return quotient.valueOf();
        }
    }

    buffer() {
        if (this.byteSize() > 8) {
            throw new RangeError(`byte-size > 8, now ${this.byteSize()} :: BigInteger; Buffer overflow. valid: byte-size <= 8.`);
        }
        const _num = new Uint64BE(this.value);
        return this._reverse(_num.toBuffer());
    }

    tight() {
        const byteLen = this.byteSize();
        const _buf = new Uint8Array(byteLen);

        var num = this.big;
        for (var i = byteLen - 1; i >= 0; i--) {
            _buf[i] = num.mod(256);
            num = num.divide(256);
        }
        return Buffer.from(_buf);
    }

    _reverse(buf) {
        const _buf = Buffer.from(buf);
        for (var i = 0; i < _buf.length / 2; i++) {
            const tmp = _buf[i];
            _buf[i] = _buf[_buf.length - 1 - i];
            _buf[_buf.length - 1 - i] = tmp;
        }
        return _buf;
    }

    compare(num) {
        return this.big.compare(num);
    }
};


const _hint = (type) => {
    return type + '-' + VERSION;
};

const parseTyped = (typed) => {
    if (typed.length < 3) {
        throw new ValidationError(`typed-length < 3, now ${typed.length} :: parsedTyped; Too short string. valid: typed-length >= 3.`);
    }

    const type = typed.substring(typed.length - 3);
    const raw = typed.substring(0, typed.length - 3);

    if (type !== MC_ADDRESS && type !== PRIVATE_KEY && type !== PUBLIC_KEY) {
        throw new ValidationError(`suffix !== ${MC_ADDRESS}, ${PRIVATE_KEY}, ${PUBLIC_KEY} :: parsedTyped; Invalid typed format.`);
    }

    return {
        type,
        raw,
    };
};

const isBCSuffix = (suffix) => {
    switch (suffix) {
        case MBC_USER_DATA:
        case MBC_LAND_DATA:
        case MBC_VOTE_DATA:
        case MBC_HISTORY_DATA:
            return true;
        default: return false;
    }
}

const isBSSuffix = (suffix) => {
    switch (suffix) {
        case MBS_DOCUMENT_DATA:
            return true;
        default: return false;
    }
}

const isDocSuffix = (suffix) => {
    return isBCSuffix(suffix) || isBSSuffix(suffix);
}

const parseDocumentId = (did) => {
    if (did.length < 3) {
        throw new ValidationError(`did-length < 3, now ${did.length} :: parsedDocumentId; Too short string. valid: did-length >= 3.`);
    }

    const id = did.substring(0, did.length - 3);
    const suffix = did.substring(did.length - 3);

    if (!isDocSuffix(suffix)) {
        throw new ValidationError(
            `suffix !== ${MBC_USER_DATA}, ${MBC_LAND_DATA}, ${MBC_VOTE_DATA}, ${MBC_HISTORY_DATA}, ${MBS_DOCUMENT_DATA} :: parsedDocumentId; Invalid typed format.`
        );
    }

    return {
        id,
        suffix,
    };
}

const parseNFTID = (nid) => {
    const i = nid.indexOf("-");
    if (i < 1 || i + 1 == nid.length) {
        throw new ValidationError(`index of "-": ${i}, nid-length: ${nid.length} :: parseNFTID; Invalid nft id.`);
    }

    const collection = nid.substring(0, i);

    let idx = nid.substring(i + 1);
    var j;
    for (j = 0; j < idx.length; j++) {
        if (idx[j] !== "0") {
            break;
        }
    }
    idx = idx.substring(j);

    return {
        collection,
        idx: new BigInteger(idx),
    };
}

const getTimeStamp = () => {
    return new Date();
};

const dateToUTC = (date) => {
    return ISOToUTC(date.toISOString());
};

const ISOToUTC = (iso) => {
    const t = iso.indexOf('T');
    let z = iso.indexOf('Z');
    let rtime;

    if (z < 0) {
        z = iso.indexOf('+');
    }

    if (z < 0) {
        throw new ValidationError(`no 'Z' in iso :: ISOtoUTC; Invalid ISO type string.`);
    }

    let _time = iso.substring(t + 1, z);
    if (_time.length > 12) {
        _time = _time.substring(0, 12);
    }

    const dotIdx = _time.indexOf('.');
    if (dotIdx < 0) {
        rtime = _time;
    }
    else {
        const decimal = _time.substring(9, _time.length);
        const idx = decimal.lastIndexOf('0');
        if (idx < 0 || idx != decimal.length - 1) {
            rtime = _time;
        }
        else {
            let startIdx = decimal.length - 1;
            for (let i = decimal.length - 1; i > -1; i--) {
                if (decimal[i] == '0') {
                    startIdx = i;
                }
                else {
                    break;
                }
            }

            if (startIdx == 0) {
                rtime = _time.substring(0, dotIdx);
            }
            else {
                rtime = _time.substring(0, dotIdx) + '.' + decimal.substring(0, startIdx);
            }
        }
    }

    return iso.substring(0, t) + ' ' + rtime + ' +0000 UTC';
};

/**
 * Hashes msg with sha256 and returns digest.
 * @param {Buffer} msg Message to hash
 * @returns {Buffer} Hash digest
 */
const sha256 = (msg) => {
    return crypto.createHash('sha256').update(msg).digest();
};

/**
 * Hashed msg with sha3-256 and returns digest.
 * @param {Buffer} msg Message to hash
 * @returns {Buffer} Hash digest
 */
const sum256 = (msg) => {
    return Buffer.from(jsSHA3.sha3_256.create().update(msg).digest());
};


module.exports = {
    BigInteger,
    _hint,
    parseTyped,
    parseDocumentId,
    parseNFTID,
    getTimeStamp,
    dateToUTC,
    ISOToUTC,
    sha256,
    sum256
};