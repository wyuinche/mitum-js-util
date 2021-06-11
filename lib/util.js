const Xconst = require('./constant');
const bignum = require('bignum');
const crypto = require('crypto');
const bs58 = require('bs58');

class BigInteger {
    constructor(big) {
        this.big = bignum(big);
    }

    get value() {
        return this.big.toNumber();
    }

    get absValue() {
        if(this.big < 0) { return bignum(-this.big.valueOf()); }
        else { return this.big; }
    }

    buffer() {
        return this._reverse(
            this.absValue.toBuffer({endian: 'big', size: 8}));
    }

    little() {
        var _result = this.absValue.toBuffer({endian: 'little', size: 'auto'});
        if(_result.length > 4){
            throw '[ERROR] Buffer overflow!'
        }
        _result = this._reverse(_result);
        _result = Buffer.concat(
            [_result, bignum(0).toBuffer(
                {endian: 'little', size: 4-_result.length})]
        );

        return _result;
    }

    tight() {
        return this._reverse(
            this.absValue.toBuffer({endian: 'big', size: 'auto'}));
    }

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

const _hint = (type) => {
    return type + '-' + Xconst.VERSION;
}

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

const getTypeFromHint = (hint) => {
    const idx = hint.lastIndexOf('-');
    
    if(idx === -1) {
        throw '[ERROR] Invalid hint format';
    }
    
    return hint.substring(0, idx);
};

const getTimeStamp = () => {
    return new Date();
};

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
}

const concatObjectsToBuffer = (arr) => {
    let concated = Buffer.alloc(0);

    for(var i = 0; i < arr.length; i++) {
        concated = Buffer.concat([concated, arr[i].buffer()]);
    }

    return concated;
}

const sha256 = (msg) => {
    return crypto.createHash('sha256').update(msg).digest();
};

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
    concatObjectsToBuffer,
    sha256,
    sum256
};