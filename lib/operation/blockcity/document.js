/*
    mitum-js-util SDK for mitum-currency, mitum-data-blocksign and mitum-blockcity
    Copyright (C) 2022 ProtoconNet

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

const { Address } = require("../../key");

const { MBC_DOCTYPE_LAND_DATA, MBC_DOCTYPE_USER_DATA, MBC_DOCTYPE_VOTE_DATA } = require('../../hint');
const { BigInteger, concatObjectsToBuffer, _hint } = require("../../util");

const DOCTYPE_USER_DATA = MBC_DOCTYPE_USER_DATA;
const DOCTYPE_LAND_DATA = MBC_DOCTYPE_LAND_DATA;
const DOCTYPE_VOTE_DATA = MBC_DOCTYPE_VOTE_DATA;


class Document {
    constructor(docType, info, owner) {
        this.hint = _hint(docType);
        this.info = info;
        this.owner = new Address(owner)
    }

    getDocType() {
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
        const doc = {};

        doc._hint = this.hint;
        doc.info = this.info.dict();
        doc.owner = this.owner.typed();
        doc.gold = this.gold.origin;
        doc.bankgold = this.bankGold.origin;
        doc.statistics = this.statistics.dict();
        
        return doc;
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
        const bStartTime = Buffer.from(this.startTime);
        const bPeriod = this.period.buffer();
        return Buffer.concat([bInfo, bOwner, bLender, bStartTime, bPeriod]);
    }

    dict() {
        const doc = {};

        doc._hint = this.hint;
        doc.info = this.info.dict();
        doc.owner = this.owner.typed();
        doc.lender = this.lender.typed();
        doc.starttime = this.startTime;
        doc.periodday = this.period.value;

        return doc;
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
        const sortedCandidates = this.candidates.sort(this.compareCandidate);

        const bInfo = this.info.buffer();
        const bOwner = this.owner.buffer();
        const bRound = this.round.buffer();
        const bCandidates = concatObjectsToBuffer(sortedCandidates);

        return Buffer.concat([bInfo, bOwner, bRound, bCandidates]);
    }

    dict() {
        const doc = {};

        doc._hint = this.hint;
        doc.info = this.info.dict();
        doc.owner = this.owner.typed();
        doc.round = this.round.value;

        const arr = [];
        for(let i = 0; i < this.candidates.length; i++) {
            arr.push(this.candidates[i].dict())
        }
        doc.candidates = arr;

        return doc;
    }

}

module.exports = {
    Document,
    UserDocument,
    LandDocument,
    VoteDocument,
    DOCTYPE_USER_DATA,
    DOCTYPE_LAND_DATA,
    DOCTYPE_VOTE_DATA
};