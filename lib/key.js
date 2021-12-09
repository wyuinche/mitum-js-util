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

/* SDK module */
const Xutil = require('./util');
const Xhint = require('./hint');

/* base58 package */
const bs58 = require('bs58');
const bs58check = require('bs58check');

/* crypto package */
const eccrypto = require('eccrypto-js');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

/**
 * @function
 * Compares two Key object by Key._buffer().
 * Used to sorting Key objects in Keys.buffer().
 * @param {Key} x - First Key object to compare
 * @param {Key} y - Second Key object to compare
 * @return {number} - Result of comparison: [ (x < y)neg num | (x == y)0 | (x > y)pos num ]
 */
const compare = (x, y) => {
    return Buffer.compare(x.key._buffer(), y.key._buffer());
}

/**
 * @class
 * Typed key.
 * @property {string} hint - '[type]-[version]'
 * @property {string} key - Hintless key
 */
class BaseKey {
    /** 
     * @constructor 
     * @param {string} key - [ (type='unknown')hinted key | (type!='unknown')hintless key ]
     * @param {string} type - [ PRIVATE_KEY | PUBLIC_KEY | 'unknown' ]
     */
    constructor(key, type) {
        if (type == 'unknown') {
            const parsed = Xutil.parseTyped(key);
            this.type = parsed.type;
            this.key = parsed.typeless;
        }
        else {
            this.type = type;
            this.key = key;
        }
    }

    /**
     * @method
     * Returns typed key.
     * @return {string} - '[key][type]'
     */
    typed() {
        return this.key + this.type;
    }

    /**
     * @method
     * Returns Buffer of typed key.
     * @return {Buffer} - Buffered typed key 
     */
    buffer() {
        return Buffer.from(this.typed());
    }

    /**
     * @method
     * Returns Buffer of typeless key.
     * @return {Buffer} - Buffered typeless key. 
     */
    _buffer() {
        return Buffer.from(this.key);
    }
};


/**
 * @class
 * Key containing key and its weight.
 * @property {string} hint - 'MC_KEY~[version]'
 * @property {BaseKey} key - BaseKey object for key
 * @property {Xutil.BigInteger} weight - weight of key 
 */
class Key {
    /** 
     * @constructor 
     * @param {string} key - Hinted key
     * @param {number} w - weight
     * */
    constructor(key, w) {
        this.hint = Xutil._hint(Xhint.MC_KEY);
        this.key = new BaseKey(key, 'unknown');
        this.weight = new Xutil.BigInteger(w.toString());
    }

    /**
     * @method
     * Concatenates key.buffer() and weight.buffer() then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: key.buffer()~weight.buffer()
     */
    buffer() {
        return Buffer.concat(
            [this.key.buffer(), this.weight.buffer()]
        );
    }

    /**
     * @method
     * Returns key dictionary.
     * @return {object} - Dictionary object: {_hint, weight, key}
     */
    dict() {
        const key = {};
        key._hint = this.hint;
        key.weight = this.weight.value;
        key.key = this.key.typed();
        return key;
    }
};



/**
 * @class
 * Keys containing Key list, threshold and hash.
 * @property {string} hint - 'MC_KEYS~[version]'
 * @property {object} keys - Array that each element is Key object
 * @property {Xutil.BigInteger} thereshold - threshold of Keys
 * @property {Buffer} hash - hash of keys

 */
class Keys {
    /**
     * @constructor
     * @param {object} keys - Array that each element is Key object
     * @param {number} threshold - threshold
     */
    constructor(keys, threshold) {
        this.hint = Xutil._hint(Xhint.MC_KEYS);
        this.keys = keys;
        this.threshold = new Xutil.BigInteger(threshold.toString());
        this.hash = this._generateHash();
    }

    /**
     * @method
     * Derive address from keys - (key, weight) pairs.
     * @return {string} - Derived address
     */
    get address() {
        return bs58.encode(this.hash) + Xhint.MC_ADDRESS;
    }

    /**
     * @method
     * Sorts keys by key.buffer().
     * Concatenates every key.buffer() in keys and threshold.buffer() then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: *key.buffer()~threshold.buffer()
     */
    buffer() {
        const karr = [];
        for (var i = 0; i < this.keys.length; i++) {
            karr.push(this.keys[i]);
        }
        const sortedkeys = karr.sort(compare);
        const bkeys = Xutil.concatObjectsToBuffer(sortedkeys)

        const bthreshold = this.threshold.buffer();

        return Buffer.concat([bkeys, bthreshold]);
    }

    /**
     * @method
     * Returns keys dictionary.
     * @return {object} - Dictionary object: {_hint, hash, threshold}
     */
    dict() {
        const keys = {};
        keys._hint = this.hint;
        keys.hash = bs58.encode(this.hash);

        const _keys = [];
        for (var i = 0; i < this.keys.length; i++) {
            _keys.push(
                this.keys[i].dict()
            );
        }
        keys.keys = _keys;
        keys.threshold = this.threshold.value;

        return keys;
    }

    /**
     * @method
     * Returns hash of Keys.buffer().
     * @return {Buffer} - hash in Buffer
     */
    _generateHash() {
        return Xutil.sum256(this.buffer());
    }
};


/**
 * @class
 * Keypair containing private key and public key.
 * @property {string} seed - Seed deriving private key. Not used when import private key directly.
 * @property {BaseKey} privKey - Private key
 * @property {BaseKey} pubKey - Public Key
 * @property {object} keypair - keypair used for signing
 */
class Keypair {
    /**
     * @constructor
     * @param {string} seed - Seed to generate private key or mitum private key itself.
     */
    constructor(seed, useSeed) {
        if(!useSeed) {
            const parsed = Xutil.parseTyped(seed);
            const type = parsed.type;
            const key = parsed.typeless;

            if (type !== Xhint.PRIVATE_KEY || key.length !== 52) {
                throw '[ERROR] Not a private key!';
            }

            this.seed = null;
            this.privKey = new BaseKey(key, type);
        }
        else {
            if (seed.length < 36) {
                throw '[ERROR] Too short seed < 36 length!';
            }

            this.seed = seed;
            this.privKey = null;
        }

        this._generatePrivateKey();
        this._generatePublicKey();
    }

    getPrivateKey() {
        return this.privKey.typed();
    }

    /**
     * @method
     * Returns hinted public key.
     * @return {string} - '[key]~[type]-[version]'
     */
    getPublicKey() {
        return this.pubKey.typed();
    }

    getRawPrivateKey() {
        return this.privKey.key;
    }

    getRawPublicKey() {
        return this.pubKey.key;
    }

    /**
     * @override
     * Generates signature for message.
     * @param {Buffer} msg - Message to sign
     * @return {Buffer} - Generated signature
     */
    sign(msg) {
        const _msg = Xutil.sha256(Xutil.sha256(msg));
        const sk = this.keypair.getPrivate('hex');

        return Buffer.from(ec.sign(_msg, sk, 'hex', { canonical: true }).toDER());
    }

    /**
     * @override
     * Generates public key by private key.
     */
    _generatePublicKey() {
        const _sk = bs58check.decode(this.privKey.key);
        const _decode = Buffer.from(_sk.slice(1, _sk.length - 1));

        this.keypair = ec.keyFromPrivate(_decode);
        this.pubKey = new BaseKey(bs58.encode(eccrypto.getPublicCompressed(_decode)), Xhint.PUBLIC_KEY);
    }

    _generatePrivateKey() {
        if (this.privKey) {
            return;
        }

        const sh = Xutil.sum256(Buffer.from(this.seed));
        const shb = Buffer.from(bs58.encode(sh));

        const genKey = (encodedSeed) => {
            encodedSeed = encodedSeed.slice(0, shb.length - 4);

            function bufToBn(buf) {
                var hex = [];
                var u8 = Uint8Array.from(buf);

                u8.forEach(function (i) {
                    var h = i.toString(16);
                    if (h.length % 2) { h = '0' + h; }
                    hex.push(h);
                });

                return BigInt('0x' + hex.join(''));
            }

            let k = bufToBn(encodedSeed);

            const N = BigInt(ec.n) - BigInt(1);
            k = k % N;

            k = k + BigInt(1);
            return Buffer.from(k.toString(16))
        };

        const encode = (key) => {
            const _pk = Buffer.from(
                '80' + key + '01', 'hex');

            let _hs = Xutil.sha256(_pk);
            _hs = Xutil.sha256(_hs);

            const checksum = Buffer.from(_hs.subarray(0, 4));

            return bs58.encode(
                Buffer.concat([_pk, checksum])
            );
        }

        this.privKey = new BaseKey(encode(genKey(shb)), Xhint.PRIVATE_KEY);
    }
};

const getNewKeypair = () => {
    const _btcKey = () => {
        const _pk = Buffer.from(
            '80' + ec.genKeyPair().getPrivate('hex') + '01', 'hex');

        let _hs = Xutil.sha256(_pk);
        _hs = Xutil.sha256(_hs);

        const checksum = Buffer.from(_hs.subarray(0, 4));

        return bs58.encode(
            Buffer.concat([_pk, checksum])
        );
    };

    return new Keypair(_btcKey(), true);
}

const getKeypairFromSeed = (seed) => {
    return new Keypair(seed, true);
}

const getKeypairFromPrivateKey = (key) => {
    return new Keypair(key, false);
}
// /**
//  * @class
//  * @extends Keypair
//  * BTC Keypair.
//  * @property {string} type - BTC_PBLCKEY
//  * @property {BaseKey} privKey - BTC Private key
//  * @property {string} pubKey - BTC Public key
//  * @property {elliptic.ec.KeyPair} keypair - BTC keypair
//  */
// class BTCKeypair extends Keypair {
//     /**
//      * @construtor
//      * @param {string} privKey - Hintless BTC private key
//      */
//     constructor(privKey) {
//         super(privKey, Xhint.BTC_PBLCKEY);
//         this._generatePublicKey();
//     }

//     /**
//      * @override
//      * Generates BTC signature for message.
//      * @param {Buffer} msg - Message to sign
//      * @return {Buffer} - Generated BTC signature
//      */
//     sign(msg) {
//         const _msg = Xutil.sha256(Xutil.sha256(msg));
//         const sk = this.keypair.getPrivate('hex');

//         return Buffer.from(ec.sign(_msg, sk, 'hex', { canonical: true }).toDER());
//     }

//     /**
//      * @override
//      * Generates BTC public key by provided private key.
//      */
//     _generatePublicKey() {
//         const _sk = bs58check.decode(this.privKey.key);
//         const _decode = Buffer.from(_sk.slice(1, _sk.length - 1));

//         this.keypair = ec.keyFromPrivate(_decode);
//         this.pubKey = bs58.encode(eccrypto.getPublicCompressed(_decode));
//     }
// };


// /**
//  * @class
//  * @extends Keypair
//  * ETHER Keypair.
//  * @property {string} type - ETHER_PBLCKEY
//  * @property {BaseKey} privKey - ETHER Private key
//  * @property {string} pubKey - ETHER Public key
//  * @property {elliptic.ec.KeyPair} keypair - ETHER keypair
//  */
// class ETHKeypair extends Keypair {
//     /**
//      * @construtor
//      * @param {string} privKey - Hintless ETHER private key
//      */
//     constructor(privKey) {
//         super(privKey, Xhint.ETHER_PBLCKEY);
//         this._generatePublicKey();
//     }
//     /**
//      * @override
//      * Generates ETHER signature for message.
//      * @param {Buffer} msg - Message to sign
//      * @return {Buffer} - Generated ETHER signature
//      */
//     sign(msg) {
//         const _msg = Xutil.sha256(msg);
//         const sk = this.keypair.getPrivate('hex');

//         const sig = ec.sign(_msg, sk, 'hex', { canonical: true }).toDER();

//         const rlen = sig[3];
//         const r = sig.slice(4, 4 + rlen);
//         const slen = sig[5 + rlen];
//         const s = sig.slice(6 + rlen);

//         const _rlen = new Xutil.BigInteger(rlen.toString());
//         const brlen = _rlen.little();

//         const buf = Buffer.alloc(rlen + slen + 4);
//         brlen.copy(buf, 0, 0, 4);
//         Buffer.from(r).copy(buf, 4, 0, rlen);
//         Buffer.from(s).copy(buf, rlen + 4, 0, slen);

//         return buf;
//     }

//     /**
//      * @override
//      * Generates ETHER public key by provided private key.
//      */
//     _generatePublicKey() {
//         if (this.privKey.key.length !== 64) {
//             throw "[ERROR] Wrong private key";
//         }
//         this.keypair = ec.keyFromPrivate(this.privKey.key);
//         this.pubKey = this.keypair.getPublic().encode('hex');
//     }
// };


// /**
//  * @class
//  * @extends Keypair
//  * Stellar Keypair.
//  * @property {string} type - STELLAR_PBLCKEY
//  * @property {BaseKey} privKey - Stellar Private key
//  * @property {string} pubKey - Stellar Public key
//  * @property {stellar.Keypair} keypair - Stellar keypair
//  */
// class StellarKeypair extends Keypair {
//     /**
//      * @construtor
//      * @param {string} privKey - Hintless Stellar private key
//      */
//     constructor(privKey) {
//         super(privKey, Xhint.STELLAR_PBLCKEY);
//         this._generatePublicKey();
//     }

//     /**
//      * @override
//      * Generates Stellar signature for message.
//      * @param {Buffer} msg - Message to sign
//      * @return {Buffer} - Generated Stellar signature
//      */
//     sign(msg) {
//         return this.keypair.sign(msg);
//     }

//     /**
//      * @override
//      * Generates Stellar public key by provided private key.
//      */
//     _generatePublicKey() {
//         this.keypair = stellar.Keypair.fromSecret(this.privKey.key);
//         this.pubKey = this.keypair.publicKey();
//     }
// };



// const _ethkp = () => {
//     return new ETHKeypair(ec.genKeyPair().getPrivate('hex'));
// }

// const _stlkp = () => {
//     return new StellarKeypair(stellar.Keypair.random().secret());
// }

// const getKeypair = (_type) => {
//     if (_type == 'btc') {
//         return _btckp();
//     }
//     else if (_type == 'ether') {
//         return _ethkp();
//     }
//     else if (_type == 'stellar') {
//         return _stlkp();
//     }
//     else {
//         throw "[ERROR] Wrong Input! (Usage: <getKeypair(#type)> type: 'btc', 'ether', 'stellar')";
//     }
// };

// const toKeypair = (_key, _type) => {
//     let type = _type;
//     let key = _key;
//     if (_type == '') {
//         if (_key.indexOf(Xhint.HINT_DIVIDER) === -1) {
//             throw "[ERROR] Wrong Input!\n(Usage: <toKeypair(key, type)> (#key, #type) must be (hinted-key, '') or (hintless-key, 'btc' | 'ether' | 'stellar'))"
//         }
//         else {
//             const parsed = Xutil.parseHinted(_key);
//             key = parsed.hintless;
//             type = Xutil.getTypeFromHint(parsed.hint);
//         }
//     }
//     switch (type) {
//         case 'btc':
//         case Xhint.BTC_PRIVKEY:
//             return new BTCKeypair(key);
//         case 'ether':
//         case Xhint.ETHER_PRIVKEY:
//             return new ETHKeypair(key);
//         case 'stellar':
//         case Xhint.STELLAR_PRIVKEY:
//             return new StellarKeypair(key);
//         default:
//             throw '[ERROR] Wrong key type'
//     }
// }

module.exports = {
    Key,
    Keys,
    Keypair,
    getNewKeypair,
    getKeypairFromSeed,
    getKeypairFromPrivateKey
};