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
        this.owner = new Address(owner);
    }

    get docType() {
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
    constructor(info, owner, address, area, renter, account, rentDate, period) {
        super(MBC_DOCTYPE_LAND_DATA, info, owner);

        this.address = address;
        this.area = area;
        this.renter = renter;
        this.account = new Address(account);
        this.rentDate = rentDate;
        this.period = new BigInteger("" + period);
    }

    buffer() {
        const bInfo = this.info.buffer();
        const bOwner = this.owner.buffer();
        const bAddress = Buffer.from(this.address);
        const bArea = Buffer.from(this.area);
        const bRenter = Buffer.from(this.renter);
        const bAccount = this.account.buffer();
        const bRentDate = Buffer.from(this.rentDate);
        const bPeriod = this.period.buffer();
        return Buffer.concat([bInfo, bOwner, bAddress, bArea, bRenter, bAccount, bRentDate, bPeriod]);
    }

    dict() {
        const doc = {};

        doc._hint = this.hint;
        doc.info = this.info.dict();
        doc.owner = this.owner.typed();
        doc.address = this.address;
        doc.area = this.area;
        doc.renter = this.renter;
        doc.account = this.account.typed();
        doc.rentDate = this.rentDate;
        doc.periodday = this.period.value;

        return doc;
    }
}

class VoteDocument extends Document {

    constructor(info, owner, round, endTime, candidates, bossName, account, office) {
        super(MBC_DOCTYPE_VOTE_DATA, info, owner);

        this.round = new BigInteger("" + round);
        this.endTime = endTime;
        this.candidates = candidates;
        this.bossName = bossName;
        this.account = new Address(account);
        this.office = office;
    }

    compareCandidate(x, y) {
        return Buffer.compare(x.buffer(), y.buffer());
    };

    buffer() {
        const sortedCandidates = this.candidates.sort(this.compareCandidate);

        const bInfo = this.info.buffer();
        const bOwner = this.owner.buffer();
        const bRound = this.round.buffer();
        const bEndTime = Buffer.from(this.endTime);
        const bBossName = Buffer.from(this.bossName);
        const bAccount = this.account.buffer();
        const bOffice = Buffer.from(this.office);
        const bCandidates = concatObjectsToBuffer(sortedCandidates);

        return Buffer.concat([bInfo, bOwner, bRound, bEndTime, bBossName, bAccount, bOffice, bCandidates]);
    }

    dict() {
        const doc = {};

        doc._hint = this.hint;
        doc.info = this.info.dict();
        doc.owner = this.owner.typed();
        doc.round = this.round.value;
        doc.endvotetime = this.endTime;

        const arr = [];
        for (let i = 0; i < this.candidates.length; i++) {
            arr.push(this.candidates[i].dict())
        }
        doc.candidates = arr;

        doc.bossname = this.bossName;
        doc.account = this.account.typed();
        doc.termofoffice = this.office;

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