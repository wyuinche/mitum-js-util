const Xutil = require('./util');
const Xkey = require('./key');
const Xhint = require('./hint');

const bs58 = require('bs58');


class FactSign {
    constructor(signer, sign, at) {
        this.hint = Xutil._hint(Xhint.BASE_FACT_SIGN);
        this.signer = signer;
        this.sign = sign;
        this.at = at;
    }

    buffer() {
        const bsigner = Buffer.from(this.signer);
        const bsign = this.sign;
        const bat = Buffer.from(Xutil.dateToUTC(this.at));
        
        return Buffer.concat([bsigner, bsign, bat]);
    }

    signedAt() {
        return this.at.toISOString();
    }

    dict() {
        const fact_sign = {};
        fact_sign._hint = this.hint;
        fact_sign.signer = this.signer;
        fact_sign.signature = bs58.encode(this.sign);
        fact_sign.signed_at = this.signedAt()
        return fact_sign;
    }
};

const getKeypair = (hintedKey) => {
    const parsed = Xutil.parseHinted(hintedKey);

    switch(Xutil.getTypeFromHint(parsed.hint)) {
        case Xhint.BTC_PRIVKEY:
            return new Xkey.BTCKeypair(parsed.hintless);
        case Xhint.ETHER_PRIVKEY:
            return new Xkey.ETHKeypair(parsed.hintless);
        case Xhint.STELLAR_PRIVKEY:
            return new Xkey.StellarKeypair(parsed.hintless);
        default: throw '[ERROR] Invalid Signing Key';
    }
};

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
    } catch(e) {
        console.log(e);
        return null;
    }

    return factSign;
};

module.exports = {
    getKeypair,
    newFactSign
};