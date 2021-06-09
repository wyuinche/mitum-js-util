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
        return this._reverse(
            this.absValue.toBuffer({endian: 'little', size: 4}));
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
    return type + ':' + Xconst.VERSION;
}

const parseHinted = (hinted) => {
    const idx = hinted.indexOf('-');
    const parsed = {};

    if(idx === -1) {
        throw '[ERROR] Invalid hinted format';
    }
    else if(hinted.indexOf(':') === -1) {
        throw '[ERROR] Invalid hint format';
    }

    parsed.hintless = hinted.substring(0, idx);
    parsed.hint = hinted.substring(idx+1);
    
    return parsed;
};

const getTypeFromHint = (hint) => {
    const idx = hint.indexOf(':');

    if(idx === -1) {
        throw '[ERROR] Invalid hint format';
    }
    
    return hint.substring(0, idx);
};

const getTimeStamp = () => {
    return new Date();
};

const getTimeZoneOffset = (date) => {
    const hour = (date.getTimezoneOffset() / 60).toString();
    const minute = (date.getTimezoneOffset() % 60).toString();

    let hh, mm;
    if(hour.length == 1) {
        hh = '+0' + hour;
    }
    else if(hour.length == 2) {
        if(hour[0] == '-'){
            hh = hour[0] + '0' + hour[1];
        }
        else {
            hh = '+' + hour;
        }
    }
    
    if(minute.length < 2) {
        mm = '0' + minute[0];
    }

    return hh + mm;
}

const dateToUTC = (date) => {
    const iso = date.toISOString();
    return iso.substring(0,10)
            .concat(
                ' ',
                iso.substring(11, 23),
                ' ',
                getTimeZoneOffset(date),
                ' UTC'
            )
}

const concatObjectsToBuffer = (arr) => {
    let concated = Buffer.from('');

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
    getTimeZoneOffset,
    dateToUTC,
    concatObjectsToBuffer,
    sha256,
    sum256
};