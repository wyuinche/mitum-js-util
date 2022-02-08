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

const { MBC_CREATE_DOCUMENTS_ITEM, MBC_UPDATE_DOCUMENTS_ITEM, MBC_CREATE_DOCUMENTS_OP_FACT, MBC_UPDATE_DOCUMENTS_OP_FACT } = require("../../hint");
const { OperationGenerator } = require("../base");
const { Candidate, Info, UserStatistics } = require("./base");
const { UserDocument, LandDocument, VoteDocument } = require("./document");
const { BlockCityItem } = require("./item");
const { BlockCityFact } = require("./fact");

class BlockCityGenerator extends OperationGenerator {

    candidate(address, manifest) {
        return new Candidate(address, manifest);
    }

    info(docType, documentId) {
        return new Info(docType, documentId);
    }

    userStatistics(hp, strength, agility, dexterity, charisma, intelligence, vital) {
        return new UserStatistics(hp, strength, agility, dexterity, charisma, intelligence, vital);
    }

    userDocument(info, owner, gold, bankGold, userStatistics) {
        return new UserDocument(info, owner, gold, bankGold, userStatistics);
    }

    landDocument(info, owner, lender, startTime, period) {
        return new LandDocument(info, owner, lender, startTime, period);
    }

    voteDocument(info, owner, round, candidates) {
        return new VoteDocument(info, owner, round, candidates);
    }

    getCreateDocumentsItem(document, currencyId) {
        return new BlockCityItem(MBC_CREATE_DOCUMENTS_ITEM, document.getDocType(), document, currencyId);
    }

    getUpdateDocumentsItem(document, currencyId) {
        return new BlockCityItem(MBC_UPDATE_DOCUMENTS_ITEM, document.getDocType(), document, currencyId);
    }

    getCreateDocumentsFact(sender, items) {
        return new BlockCityFact(MBC_CREATE_DOCUMENTS_OP_FACT, sender, items);
    }

    getUpdateDocumentsFact(sender, items) {
        return new BlockCityFact(MBC_UPDATE_DOCUMENTS_OP_FACT, sender, items);
    }
};


module.exports = {
    BlockCityGenerator,
};