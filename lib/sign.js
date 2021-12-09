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
const Xkey = require('./key');
const Xhint = require('./hint');

/* base58 package */
const bs58 = require('bs58');


/**
 * @class
 * Fact Signature.
 * @property {string} hint - 'BASE_FACT_SIGN-[version]'
 * @property {string} signer - signer
 * @property {Buffer} sign - Fact signature
 * @property {Date} at - Signed time
 */
class FactSign {
    /**
     * @constructor
     * @param {string} signer - signer who signed
     * @param {Buffer} sign - Fact signature
     * @param {Date} at - Signed time
     */
    constructor(signer, sign, at) {
        this.hint = Xutil._hint(Xhint.BASE_FACT_SIGN);
        this.signer = signer;
        this.sign = sign;
        this.at = at;
    }

    /**
     * @method
     * Concatenate signer-Buffer, sign-Buffer, and UTC-format-at-Buffer then
     * Returns concatenated Buffer.
     * @return {Buffer} - Concatenated Buffer: signer-Buffer~sign-Buffer~UTC-at-Buffer
     */
    buffer() {
        const bsigner = Buffer.from(this.signer);
        const bsign = this.sign;
        const bat = Buffer.from(Xutil.dateToUTC(this.at));

        return Buffer.concat([bsigner, bsign, bat]);
    }

    /**
     * @method
     * Returns at in ISO format.
     * @return {string} - ISO formatted at
     */
    signedAt() {
        return this.at.toISOString();
    }

    /**
     * @method
     * Returns fact signature dictionary.
     * @return {object} - {_hint, signer, signature, signed_at}
     */
    dict() {
        const fact_sign = {};
        fact_sign._hint = this.hint;
        fact_sign.signer = this.signer;
        fact_sign.signature = bs58.encode(this.sign);
        fact_sign.signed_at = this.signedAt()
        return fact_sign;
    }
};

/**
 * @function
 * Generate new fact signature.
 * @param {Buffer} msg - Message to sign
 * @param {string} hintedKey - Hinted signing key
 * @return {FactSign} - Generated fact signature signed by hintedKey
 */
const newFactSign = (msg, typedKey) => {
    let factSign;
    let keypair;

    try {
        keypair = new Xkey.Keypair(typedKey);
        factSign = new FactSign(
            keypair.getPublicKey(),
            keypair.sign(msg),
            Xutil.getTimeStamp()
        );
    } catch (e) {
        console.log("Fail to create new fact sign");
        return null;
    }

    return factSign;
};

module.exports = {
    FactSign,
    newFactSign
};