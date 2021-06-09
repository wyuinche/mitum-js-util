const Xutil = require('./util');
const Xhint = require('./hint');

const bs58 = require('bs58');
const bs58check = require('bs58check');

const stellar = require('stellar-sdk');
const eccrypto = require('eccrypto-js');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');


const compare = (x, y) => {
    return Buffer.compare(x.key._buffer(), y.key._buffer());
}

class BaseKey {
    constructor(key, type){
        if(type == 'unknown'){
            const parsed = Xutil.parseHinted(key);
            this.hint = parsed.hint;
            this.key = parsed.hintless;
        }
        else{
            this.hint = Xutil._hint(type);
            this.key = key;
        }
    }

    hinted() {
        return this.key + ':' + this.hint;
    }

    _buffer() {
        return Buffer.from(this.key);
    }
};

class Key {
    constructor(key, w){
        this.hint = Xutil._hint(Xhint.MC_KEY);
        this.key = new BaseKey(key, 'unknown');
        this.weight = new Xutil.BigInteger(w);
    }

    buffer() {
        return Buffer.concat(
            [this.key._buffer(), Buffer.from(':' + this.key.hint), this.weight.buffer()]
        );
    }

    dict() {
        const key = {};
        key._hint = this.hint;
        key.weight = this.weight.value;
        key.key = this.key.hinted();
        return key;
    }
};

class Keys {
    constructor(keys, threshold){
        this.hint = Xutil._hint(Xhint.MC_KEYS);
        this.keys = keys;
        this.threshold = new Xutil.BigInteger(threshold);

        this.hash = this._generateHash();
    }

    buffer() {
        const karr = [];
        for(var i = 0; i < this.keys.length; i++) {
            karr.push(this.keys[i]);
        }
        const sortedkeys = karr.sort(compare);

        const bthreshold = this.threshold.buffer();

        var bkeys = Buffer.from("");
        for(var i = 0; i < sortedkeys.length; i++) {
            bkeys = Buffer.concat([bkeys, sortedkeys[i].buffer()]);
        }

        return Buffer.concat([bkeys, bthreshold]);
    }

    dict() {
        const keys = {};
        keys._hint = this.hint;
        keys.hash = bs58.encode(this.hash);
        
        const _keys = [];
        for(var i = 0; i < this.keys.length; i++){
            _keys.push(
                this.keys[i].dict()
            );
        }
        keys.keys = _keys;
        keys.threshold = this.threshold.value;

        return keys;
    }

    _generateHash() {
        return Xutil.sum256(this.buffer());
    }
};

class Keypair {
    constructor(privKey, type) {
        switch(type) {
            case Xhint.BTC_PBLCKEY:
                this.privKey = new BaseKey(privKey, Xhint.BTC_PRIVKEY);
                break;
            case Xhint.ETHER_PBLCKEY:
                this.privKey = new BaseKey(privKey, Xhint.ETHER_PRIVKEY);
                break;
            case Xhint.STELLAR_PBLCKEY:
                this.privKey = new BaseKey(privKey, Xhint.STELLAR_PRIVKEY);
                break;
            default:
                throw '[ERROR] Invalid keypair type';
        }
        this.pubKey = undefined;
        this.type = type;
    }

    getPublicKey() {
        return this.pubKey + ':' + Xutil._hint(this.type);
    }

    sign(msg) {
        throw '[ERROR] Unimplemented function sign(msg)';
    }

    _generatePublicKey() {
        throw '[ERROR] Unimplemented function _generatePublicKey()';
    }
};

class BTCKeypair extends Keypair {
    constructor(privKey) {
        super(privKey, Xhint.BTC_PBLCKEY);
        this._generatePublicKey();
    }

    sign(msg) {
        const _msg = Xutil.sha256(Xutil.sha256(msg));
        const sk = this.keypair.getPrivate('hex');

        return Buffer.from(ec.sign(_msg, sk, 'hex', {canonical: true}).toDER());
    }

    _generatePublicKey() {
        const _sk = bs58check.decode(this.privKey.key);
        const _decode = Buffer.from(_sk.slice(1, _sk.length-1));
        
        this.keypair = ec.keyFromPrivate(_decode);
        this.pubKey = bs58.encode(eccrypto.getPublicCompressed(_decode));
    }
};

class ETHKeypair extends Keypair {
    constructor(privKey) {
        super(privKey, Xhint.ETHER_PBLCKEY);
        this._generatePublicKey();
    }

    sign(msg) {
        const _msg = Xutil.sha256(msg);
        const sk = this.keypair.getPrivate('hex');
        
        const sig = ec.sign(_msg, sk, 'hex', {canonical: true}).toDER();

        const rlen = sig[3];
        const r = sig.slice(4, 4+rlen);
        const slen = sig[5+rlen];
        const s = sig.slice(6+rlen);

        const brlen = Buffer.allocUnsafe(4);
        brlen.writeUInt8(rlen);

        const buf = Buffer.alloc(rlen + slen + 4);
        brlen.copy(buf, 0, 0, 4);
        Buffer.from(r).copy(buf, 4, 0, rlen);
        Buffer.from(s).copy(buf, rlen, 0, slen);

        return buf;
    }
    
    _generatePublicKey() {
        this.keypair = ec.keyFromPrivate(this.privKey.key);
        this.pubKey = this.keypair.getPublic().encode('hex');
    }
};

class StellarKeypair extends Keypair {
    constructor(privKey) {
        super(privKey, Xhint.STELLAR_PBLCKEY);
        this._generatePublicKey();
    }

    sign(msg) {
        return this.keypair.sign(msg);
    }

    _generatePublicKey() {
        this.keypair = stellar.Keypair.fromSecret(this.privKey.key);
        this.pubKey = this.keypair.publicKey();
    }
};

module.exports = {
    Key,
    Keys,
    BTCKeypair,
    ETHKeypair,
    StellarKeypair
};