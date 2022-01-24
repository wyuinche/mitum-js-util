const { Address } = require("../../key");

const { MBC_DOCTYPE_LAND_DATA, MBC_DOCTYPE_USER_DATA, MBC_DOCTYPE_VOTE_DATA } = require('../../hint');
const { BigInteger, concatObjectsToBuffer } = require("../../util");

exports.DOCTYPE_USER_DATA = MBC_DOCTYPE_USER_DATA;
exports.DOCTYPE_LAND_DATA = MBC_DOCTYPE_LAND_DATA;
exports.DOCTYPE_VOTE_DATA = MBC_DOCTYPE_VOTE_DATA;


class Document {
    constructor(docType, info, owner) {
        this.hint = _hint(docType);
        this.info = info;
        this.owner = new Address(owner)
    }

    getDoctype() {
        return this.info.docType;
    }
}

class UserDocument extends Document {

    constructor(info, owner, gold, bankGold, userStatistics) {
        super(MBC_DOCTYPE_USER_DATA, info, owner);

        this.gold = new BigInteger(gold);
        this.bankGold = new BigInteger(bankGold);
        this.statistics = userStatistics;
    }

    buffer() {
        const bInfo = this.info.buffer();
        const bOwner = this.owner.buffer();
        const bGold = this.gold.tight();
        const bBankGold = this.bankGold.tight();
        const bStatistics = this.statistics.buffer();
        return Buffer.concat([bInfo, bOwner, bGold, bBankGold, bStatistics]);
    }

    dict() {

    }
}

class LandDocument extends Document {
    constructor(info, owner, lender, startTime, period) {
        super(MBC_DOCTYPE_LAND_DATA, info, owner);

        this.lender = new Address(lender);
        this.startTime = startTime;
        this.period = new BigInteger("" + period);
    }

    buffer() {
        const bInfo = this.info.buffer();
        const bOwner = this.owner.buffer();
        const bLender = this.lender.buffer();
        const bStartTime = this.startTime.encode();
        const bPeriod = this.period.buffer();
        return Buffer.concat([bInfo, bOwner, bLender, bStartTime, bPeriod]);
    }

    dict() {

    }
}

class VoteDocument extends Document {

    constructor(info, owner, round, candidates) {
        super(MBC_DOCTYPE_VOTE_DATA, info, owner);

        this.round = new BigInteger("" + round);
        this.candidates = candidates;
    }

    compareCandidate(x, y) {
        return Buffer.compare(x.buffer(), y.buffer());
    };

    buffer() {
        const sortedCandidates = this.candidate.sort(this.compareCandidate);

        const bInfo = this.info.buffer();
        const bOwner = this.owner.buffer();
        const bRound = this.round.buffer();
        const bCandidates = concatObjectsToBuffer(sortedCandidates);

        return Buffer.concat([bInfo, bOwner, bRound, bCandidates]);
    }

    dict() {

    }

}

module.exports = {
    Document,
    UserDocument,
    LandDocument,
    VoteDocument
};