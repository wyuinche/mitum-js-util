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

const { BaseKey } = require('./base');

// util
const { parseTyped, sha256, sum256 } = require('../util');

// hint
const { PRIVATE_KEY, PUBLIC_KEY } = require('../hint');

// encode
const bs58 = require('bs58');
const bs58check = require('bs58check');

// crypto
const ecCrypto = require('eccrypto-js');
const elliptic = require('elliptic');
const { ValidationError } = require('../errors');
const ec = new elliptic.ec('secp256k1');


class Keypair {

    constructor(seed, useSeed) {
        if (!useSeed) {
            const parsed = parseTyped(seed);
            const type = parsed.type;
            const key = parsed.raw;

            if (type !== PRIVATE_KEY || key.length !== 52) {
                throw new ValidationError(`suffix !== ${PRIVATE_KEY} or key-length !== 52, now key-length: ${key.length} :: Keypair; Not a private key. valid: key-length == 52.`);
            }

            this.seed = null;
            this.privKey = new BaseKey(key, type);
        }
        else {
            if (seed.length < 36) {
                throw new ValidationError(`seed-length < 36, now ${seed.length} :: Keypair; Too short seed. valid: seed-length >= 36.`);
            }

            this.seed = seed;
            this.privKey = null;
        }

        this._generatePrivateKey();
        this._generatePublicKey();
    }

    /**
     * @returns {string} Typed private key
     */
    getPrivateKey() {
        return this.privKey.typed();
    }

    /**
     * @returns {string} Typed public key 
     */
    getPublicKey() {
        return this.pubKey.typed();
    }

    /**
     * @returns {string} Raw private key
     */
    getRawPrivateKey() {
        return this.privKey.key;
    }

    /**
     * @returns {string} Raw public key 
     */
    getRawPublicKey() {
        return this.pubKey.key;
    }

    /**
     * Signs the target message and returns a signature digest.
     * @param {string} msg Target message to sign 
     * @returns {Buffer} Signature digest
     */
    sign(msg) {
        const _msg = sha256(sha256(msg));
        const sk = this.keypair.getPrivate('hex');

        return Buffer.from(ec.sign(_msg, sk, 'hex', { canonical: true }).toDER());
    }

    _generatePublicKey() {
        const _sk = bs58check.decode(this.privKey.key);
        const _decode = Buffer.from(_sk.slice(1, _sk.length - 1));

        this.keypair = ec.keyFromPrivate(_decode);
        this.pubKey = new BaseKey(bs58.encode(ecCrypto.getPublicCompressed(_decode)), PUBLIC_KEY);
    }

    _generatePrivateKey() {
        if (this.privKey) {
            return;
        }

        const sh = sum256(Buffer.from(this.seed));
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

        this.privKey = new BaseKey(encodeKey(genKey(shb)), PRIVATE_KEY);
    }
};


const encodeKey = (key) => {
    const _pk = Buffer.from(
        '80' + key + '01', 'hex');

    let _hs = sha256(_pk);
    _hs = sha256(_hs);

    const checksum = Buffer.from(_hs.subarray(0, 4));

    return bs58.encode(
        Buffer.concat([_pk, checksum])
    );
}

/**
 * Returns a new keypair.
 * @returns {Keypair} Keypair
 */
const getNewKeypair = () => {
    return getKeypairFromPrivateKey(encodeKey(ec.genKeyPair().getPrivate('hex')) + PRIVATE_KEY);
}

/**
 * Returns a new keypair generated from a string seed.
 * The seed must be at least 36 long.
 * @param {string} seed Seed to generate Keypair (len(seed) >= 36) 
 * @returns {Keypair} Keypair from seed
 */
const getKeypairFromSeed = (seed) => {
    return new Keypair(seed, true);
}

/**
 * Returns a new key pair generated from private key.
 * Private key must be a mitum key with suffix (mpr).
 * @param {string} key Key - '{wif key}mpr' 
 * @returns {Keypair} Keypair generated from private key
 */
const getKeypairFromPrivateKey = (key) => {
    return new Keypair(key, false);
}


module.exports = {
    Keypair,
    getNewKeypair,
    getKeypairFromSeed,
    getKeypairFromPrivateKey
};