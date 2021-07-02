const Xconst = require('./constant');
const crypto = require('crypto');

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
        this.big = BigInt(big);
        this.num = big;
    }

    /**
     * @property
     * Returns big in number.
     * @return {number} - big
     */
    get value() {
        return this.num;
    }

    /**
     * @property
     * Returns absolute value of big.
     * @return {BigInt} - abs(big)
     */
    get absValue() {
        if(this.big < 0) { return BigInt(-this.value); }
        else { return this.big; }
    }

    byteSize() {
        return (this.num < 2)? 1 : Math.ceil((Math.log(this.num)/Math.log(2))/8);
    }

    /**
     * @method
     * Returns 8-length Buffer of big by big-endian.
     * @return {Buffer} - 8-length big-endian Buffer of big
     */
    buffer() {
        if(this.byteSize() > 8) {
            throw '[ERROR] Buffer overflow!';
        }
        const _buf = Buffer.alloc(8);
        _buf.writeBigInt64BE(this.absValue);
        return this._reverse(_buf);
    }

    /**
     * @method
     * Returns tight-length Buffer of big by little-endian.
     * @return {Buffer} - tight-length little-endian Buffer of big
     */
    little() {
        if(this.byteSize() > 4){
            throw '[ERROR] Buffer overflow!'
        }
        var _buffer = Buffer.alloc(this.byteSize());
        const _off = Buffer.alloc(4-this.byteSize());
        
        _buffer.writeUIntLE(this.num, 0, this.byteSize());
        _buffer = this._reverse(_buffer);
        
        return Buffer.concat([_buffer, _off]);
    }

    /**
     * @method
     * Returns tight-length Buffer of big by big-endian.
     * @return {Buffer} - tight-length big-endian Buffer of big
     */
    tight() {
        if(this.byteSize() > 8) {
            throw '[ERROR] Buffer overflow!';
        }
        const _buf = Buffer.alloc(this.byteSize());
        _buf.writeUIntBE(this.num, 0, this.byteSize());
        return this._reverse(_buf);
    }

    /**
     * @method
     * Returns reversed Buffer.
     * @param {Buffer} buf - Buffer object to reverse
     * @return {Buffer} - Reversed Buffer
     */
    _reverse(buf){
        const _buf = Buffer.from(buf);
        for(var i = 0; i < _buf.length / 2; i++){
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

    if(idx === -1) {
        throw '[ERROR] Invalid hinted format';
    }
    else if(hinted.indexOf('-') === -1) {
        throw '[ERROR] Invalid hint format';
    }

    parsed.hintless = hinted.substring(0, idx);
    parsed.hint = hinted.substring(idx+1);
    
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
    
    if(idx === -1) {
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
 * @param {Date} date - Date object to change format
 * @return {string} - UTC-format date string
 */
const dateToUTC = (date) => {
    const iso = date.toISOString();
    return iso.substring(0,10)
            .concat(
                ' ',
                iso.substring(11, 23),
                ' ',
                '+0000',
                ' UTC'
            )
};

const ISOToUTC = (iso) => {
    return iso.substring(0,10)
            .concat(
                ' ',
                iso.substring(11, 23),
                ' ',
                '+0000',
                ' UTC'
            )
};

/**
 * @function
 * Concatenates Buffers in array then returns concatenated Buffer.
 * @param {object} arr - Array that each element is an object implementing buffer() method
 * @return {Buffer} - Concatenated Buffer
 */
const concatObjectsToBuffer = (arr) => {
    let concated = Buffer.alloc(0);

    for(var i = 0; i < arr.length; i++) {
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
    return crypto.createHash('sha3-256').update(msg).digest();
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