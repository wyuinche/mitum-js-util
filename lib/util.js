/*
    mitum-js-util SDK for mitum-currency and mitum-data-blocksign
    Copyright (C) 2021 ProtoconNet

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

const Xconst = require('./constant');
const crypto = require('crypto');
const jsSHA3 = require('js-sha3');
const { Uint64BE } = require('int64-buffer');
const bigInt = require('big-integer');

/**
 * @class
 * Contains big number and Converts number to Buffer.
 * @property {BigInt} big - number in BigInt
 * @property {number} num - number in Number
 */
class BigInteger {
    /**
     * @constructor
     * @param {number} big - number
     */
    constructor(big) {
        const strBig = this.eToNumber(big);
        if (strBig.length > 16) {
            if (typeof big !== 'bigint' && typeof big !== 'string') {
                throw new Error("[ERROR] Too big amount to process; Use big number expression or string type input if amount > 9007199254740991(js max safe interger).");
            }

            this.big = null;
            this.origin = strBig;

            const tmp = bigInt(strBig);
            this.up = tmp.divide(Math.pow(256, 6));
            this.down = tmp.minus(this.up.multiply(Math.pow(256, 6)));
        }
        else {
            if (!this.isSafe(big)) {
                throw new Error("[ERROR] Too big amount to process; Use big number expression or string type input if amount > 9007199254740991(js max safe interger).");
            }
            this.big = bigInt(big);
        }
    }

    /**
     * @property
     * Returns big in number.
     * @return {number} - big
     */
    get value() {
        if (this.big) {
            return this.big.valueOf();
        }
        else {
            return this.up.multiply(Math.pow(2, 12)).add(this.down).valueOf();
        }
    }

    get rawValue() {
        if (this.big) {
            return this.eToNumber(this.big.valueOf());
        }
        else {
            return this.origin;
        }
    }

    isSafe(num) {
        if(bigInt(num).greater(Number.MAX_SAFE_INTEGER)) {
            return false;
        }
        
        const MAX_VALUE = "9007199254740991";
        num += "";
        
        if(parseInt(num[0]) < parseInt(MAX_VALUE[0])) {
            return true;
        }
        else if(parseInt(num.substring(1)) <= parseInt(MAX_VALUE.substring(1))) {
             return true;
        }

        return false;
    }

    /**
     * @property
     * Returns absolute value of big.
     * @return {BigInt} - abs(big)
     */
    get absValue() {
        return this.value;
    }

    /******************************************************************
    * Converts e-Notation Numbers to Plain Numbers
    ******************************************************************
    * @function eToNumber(number)
    * @version  1.00
    * @param   {e nottation Number} valid Number in exponent format.
    *          pass number as a string for very large 'e' numbers or with large fractions
    *          (none 'e' number returned as is).
    * @return  {string}  a decimal number string.
    * @author  Mohsen Alyafei
    * @date    17 Jan 2020
    * Note: No check is made for NaN or undefined input numbers.
    * https://stackoverflow.com/a/66072001
    *****************************************************************/
    eToNumber(num) {
        let sign = "";
        (num += "").charAt(0) == "-" && (num = num.substring(1), sign = "-");

        let arr = num.split(/[e]/ig);
        if (arr.length < 2) {
            return sign + num;
        }
        let dot = (.1).toLocaleString().substr(1, 1), n = arr[0], exp = +arr[1],
            w = (n = n.replace(/^0+/, '')).replace(dot, ''),
            pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
            L = pos - w.length, s = "" + BigInt(w);
        w = exp >= 0 ? (L >= 0 ? s + "0".repeat(L) : r()) : (pos <= 0 ? "0" + dot + "0".repeat(Math.abs(pos)) + s : r());
        L = w.split(dot); if (L[0] == 0 && L[1] == 0 || (+w == 0 && +s == 0)) w = 0; //** added 9/10/2021

        return sign + w;

        function r() {
            return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`)
        }
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

    /**
     * @method
     * Returns 8-length Buffer of big by big-endian.
     * @return {Buffer} - 8-length big-endian Buffer of big
     */
    buffer() {
        if (this.byteSize() > 8) {
            throw '[ERROR] Buffer overflow!';
        }
        const _num = new Uint64BE(this.absValue.valueOf());
        return this._reverse(_num.toBuffer());
    }

    /**
     * @method
     * Returns tight-length Buffer of big by little-endian.
     * @return {Buffer} - tight-length little-endian Buffer of big
     */
    little() {
        if (this.byteSize() > 4) {
            throw '[ERROR] Buffer overflow!'
        }
        var _buffer = Buffer.alloc(this.byteSize());
        const _off = Buffer.alloc(4 - this.byteSize());

        _buffer.writeUIntLE(this.value, 0, this.byteSize());
        _buffer = this._reverse(_buffer);

        return Buffer.concat([_buffer, _off]);
    }

    /**
     * @method
     * Returns tight-length Buffer of big by big-endian.
     * @return {Buffer} - tight-length big-endian Buffer of big
     */
    tight() {
        const byteLen = this.byteSize();

        if (this.big) {
            const _buf = new Uint8Array(byteLen);
            var num = this.big;
            for (var i = byteLen - 1; i >= 0; i--) {
                _buf[i] = num.mod(256);
                num = num.divide(256);
            }
            return Buffer.from(_buf);
        }
        else {
            var up = new BigInteger(this.up);
            var down = new BigInteger(this.down);

            return Buffer.concat([up.tight(), down.tight()]);
        }
    }

    /**
     * @method
     * Returns reversed Buffer.
     * @param {Buffer} buf - Buffer object to reverse
     * @return {Buffer} - Reversed Buffer
     */
    _reverse(buf) {
        const _buf = Buffer.from(buf);
        for (var i = 0; i < _buf.length / 2; i++) {
            const tmp = _buf[i];
            _buf[i] = _buf[_buf.length - 1 - i];
            _buf[_buf.length - 1 - i] = tmp;
        }
        return _buf;
    }
}

/**
 * @function
 * Add mitum-currency version to hint type.
 * @param {string} type - mitum or mitum-currency type
 * @return {string} - '[type]-[version]'
 */
const _hint = (type) => {
    return type + '-' + Xconst.VERSION;
}

/**
 * @function
 * Parses hinted address or hinted key.
 * @param {string} hinted - Hinted addrss/key
 * @return {object} - Parsing result # object{hintless, hint}
 */
const parseHinted = (hinted) => {
    const idx = hinted.indexOf(':');
    const parsed = {};

    if (idx === -1) {
        throw '[ERROR] Invalid hinted format';
    }
    else if (hinted.indexOf('-') === -1) {
        throw '[ERROR] Invalid hint format';
    }

    parsed.hintless = hinted.substring(0, idx);
    parsed.hint = hinted.substring(idx + 1);

    return parsed;
};

/**
 * @function
 * Extracts type from hint # hint: [type]-[version]
 * @param {string} hint - '[type]-[version]' format hint
 * @return {string} - mitum or mitum-currency hint type
 */
const getTypeFromHint = (hint) => {
    const idx = hint.lastIndexOf('-');

    if (idx === -1) {
        throw '[ERROR] Invalid hint format';
    }

    return hint.substring(0, idx);
};

/**
 * @function
 * Returns timestamp as Date.
 * @return {Date} - Timestamp in Date
 */
const getTimeStamp = () => {
    return new Date();
};

/**
 * @function
 * Returns UTC formatted date.
 * Time Zone Offset must be +0000.
 * @param {Date} date - Date object to change
 * @return {string} - UTC-format date string
 */
const dateToUTC = (date) => {
    return ISOToUTC(date.toISOString());
};

/**
 * @function
 * Returns UTC formatted date.
 * Time Zone Offset must be +0000.
 * @param {string} iso - iso string to change
 * @return {string} - UTC-format date string
 */
const ISOToUTC = (iso) => {
    const t = iso.indexOf('T');
    let z = iso.indexOf('Z');
    let rtime;

    if (z < 0) {
        z = iso.indexOf('+');
    }

    if (z < 0) {
        throw new Error("Invalid ISO type for ISOtoUTC");
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
}

/**
 * @function
 * Concatenates Buffers in array then returns concatenated Buffer.
 * @param {object} arr - Array that each element is an object implementing buffer() method
 * @return {Buffer} - Concatenated Buffer
 */
const concatObjectsToBuffer = (arr) => {
    let concated = Buffer.alloc(0);

    for (var i = 0; i < arr.length; i++) {
        concated = Buffer.concat([concated, arr[i].buffer()]);
    }

    return concated;
}

/**
 * @function
 * Returns sha2-256 hash of msg.
 * @param {Buffer} msg - Message to hash
 * @return {Buffer} - Hash digest of msg
 */
const sha256 = (msg) => {
    return crypto.createHash('sha256').update(msg).digest();
};

/**
 * @function
 * Returns sha3-256 hash of msg.
 * @param {Buffer} msg - Message to hash
 * @return {Buffer} - Hash digest of msg
 */
const sum256 = (msg) => {
    return Buffer.from(jsSHA3.sha3_256.create().update(msg).digest());
};

module.exports = {
    BigInteger,
    _hint,
    parseHinted,
    getTypeFromHint,
    getTimeStamp,
    dateToUTC,
    ISOToUTC,
    concatObjectsToBuffer,
    sha256,
    sum256
};