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
 * Parse hinted private key then generate keypair.
 * @param {string} hintedKey - Hinted private key
 * @return {Xkey.Keypair} - [ BTCKeypair | ETHERKeypair | StellarKeypair ]
 */
const getKeypair = (hintedKey) => {
    const parsed = Xutil.parseHinted(hintedKey);

    switch (Xutil.getTypeFromHint(parsed.hint)) {
        case Xhint.BTC_PRIVKEY:
            return new Xkey.BTCKeypair(parsed.hintless);
        case Xhint.ETHER_PRIVKEY:
            return new Xkey.ETHKeypair(parsed.hintless);
        case Xhint.STELLAR_PRIVKEY:
            return new Xkey.StellarKeypair(parsed.hintless);
        default: throw '[ERROR] Invalid Signing Key';
    }
};

/**
 * @function
 * Generate new fact signature.
 * @param {Buffer} msg - Message to sign
 * @param {string} hintedKey - Hinted signing key
 * @return {FactSign} - Generated fact signature signed by hintedKey
 */
const newFactSign = (msg, hintedKey) => {
    let factSign;
    let keypair;

    try {
        keypair = getKeypair(hintedKey);
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
    getKeypair,
    newFactSign
};