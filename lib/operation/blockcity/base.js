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

const { MBC_DOCUMENT_INFO, MBC_VOTING_CANDIDATE, MBC_USER_STATISTICS, MBC_DOCTYPE_USER_DATA, MBC_USER_DOCUMENT_ID, MBC_DOCTYPE_LAND_DATA, MBC_LAND_DOCUMENT_ID, MBC_DOCTYPE_VOTE_DATA, MBC_VOTE_DOCUMENT_ID } = require("../../hint");
const { Address } = require("../../key");
const { _hint, parseDocumentId, BigInteger } = require("../../util");

class DocumentId {
    constructor(documentId) {
        const parsed = parseDocumentId(documentId);
        this._id = new BigInteger(parsed.id);
        this._type = parsed.suffix;
    }

    get documentId() {
        return this._id.rawValue + this._type;
    }

    get id() {
        return this._id.rawValue;
    }

    get type() {
        return this._type;
    }

    buffer() {
        return Buffer.from(this.documentId);
    }
}

class Info {
    constructor(docType, documentId) {
        this.hint = _hint(MBC_DOCUMENT_INFO);
        this.docType = docType;
        this.documentId = new DocumentId(documentId);
    }

    buffer() {
        const bDocumentId = this.documentId.buffer();
        const bDocType = Buffer.from(this.docType);
        return Buffer.concat([bDocumentId, bDocType]);
    }

    dict() {
        const docId = {};
        
        switch(this.docType) {
            case MBC_DOCTYPE_USER_DATA:
                docId._hint = _hint(MBC_USER_DOCUMENT_ID);
                break;
            case MBC_DOCTYPE_LAND_DATA:
                docId._hint = _hint(MBC_LAND_DOCUMENT_ID);
                break;
            case MBC_DOCTYPE_VOTE_DATA:
                docId._hint = _hint(MBC_VOTE_DOCUMENT_ID);
                break;
            default:
                throw '[ERROR] Invalid document type for Info.dict()';
        }

        docId.id = this.documentId.documentId;

        const info = {};
        
        info._hint = this.hint;
        info.docid = docId;
        info.doctype = this.docType;

        return info;
    }
}

class Candidate {
    constructor(address, manifest) {
        if(manifest.length > 100) {
            throw '[ERROR] manifest length is over 100! (manifest.length <= 100)';
        }

        this.hint = _hint(MBC_VOTING_CANDIDATE);
        this.address = new Address(address);
        this.manifest = manifest;
    }

    buffer() {
        const bAddress = this.address.buffer();
        const bManifest = Buffer.from(this.manifest);
        return Buffer.concat([bAddress, bManifest]);
    }

    dict() {
        const candidate = {};
        candidate._hint = this.hint;
        candidate.address = this.address.typed();
        candidate.manifest = this.manifest;

        return candidate;
    }
}

class UserStatistics {
    constructor(hp, str, agi, dex, cha, intel, vital) {
        this.hint = _hint(MBC_USER_STATISTICS);

        this.hp = new BigInteger("" + hp);
        this.str = new BigInteger("" + str);
        this.agi = new BigInteger("" + agi);
        this.dex = new BigInteger("" + dex);
        this.cha = new BigInteger("" + cha);
        this.intel = new BigInteger("" + intel);
        this.vital = new BigInteger("" + vital);
    }

    buffer() {
        return Buffer.concat([
            this.hp.buffer(),
            this.str.buffer(),
            this.agi.buffer(),
            this.dex.buffer(),
            this.cha.buffer(),
            this.intel.buffer(),
            this.vital.buffer(),
        ]);
    }

    dict() {
        const statistics = {};

        statistics._hint = this.hint;
        statistics.hp = this.hp.value;
        statistics.strength = this.str.value;
        statistics.agility = this.agi.value;
        statistics.dexterity = this.dex.value;
        statistics.charisma = this.cha.value;
        statistics.intelligence = this.intel.value;
        statistics.vital = this.vital.value;

        return statistics;
    }
}

module.exports = {
    Info,
    Candidate,
    UserStatistics
};