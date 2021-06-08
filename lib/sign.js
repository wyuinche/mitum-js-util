const util = require('./util');
const key = require('./key');
const hint = require('./hint');


class FactSign {
    constructor(signer, sign, at) {
        this.hint = util._hint(hint.BASE_FACT_SIGN);
        this.signer = signer;
        this.sign = sign;
        this.at = at;
    }

    buffer() {
        const bsigner = Buffer.from(this.signer);
        const bsign = this.sign;
        const bat = Buffer.from(util.dateToUTC(this.at));
        
        return Buffer.concat([bsigner, bsign, bat]);
    }

    signedAt() {
        return this.at.toISOString();
    }
};

const getKeypair = (hintedKey) => {
    const parsed = util.parseHinted(hintedKey);

    switch(util.getTypeFromHint(parsed.hint)) {
        case hint.BTC_PRIVKEY:
            return new key.BTCKeypair(parsed.hintless);
        case hint.ETHER_PRIVKEY:
            return new key.ETHKeypair(parsed.hintless);
        case hint.STELLAR_PRIVKEY:
            return new key.StellarKeypair(parsed.hintless);
        default: throw '[ERROR] Invalid Signing Key';
    }
};

exports.newFactSign = (msg, hintedKey) => {
    let factSign;
    let keypair;

    try {
        keypair = getKeypair(hintedKey);
        factSign = new FactSign(
            keypair.getPublicKey(),
            keypair.sign(msg),
            util.getTimeStamp()
        );
    } catch(e) {
        console.log(e);
        return null;
    }

    return factSign;
};