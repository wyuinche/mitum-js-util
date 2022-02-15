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
const { UserDocument, LandDocument, VoteDocument, HistoryDocument } = require("./document");
const { BlockCityItem } = require("./item");
const { BlockCityFact } = require("./fact");


/**
 * @class
 * @extends OperationGenerator
 * BlockCityGenerator helps to generate data and json files to send to mitum-blockcity network.
 * Before you use methods of BlockCityGenerator, network id should be set, first.
 * @property {string} id
 */
class BlockCityGenerator extends OperationGenerator {

    /**
     * Returns Candidate object with address, nickname and manifest. 
     * @param {string} address Address
     * @param {string} nickname Nickname
     * @param {string} manifest Manifest
     * @returns {Candidate} Candidate
     */
    candidate(address, nickname, manifest) {
        return new Candidate(address, nickname, manifest);
    }

    /**
     * Returns Info object for each document type.
     * @param {string} docType Document type - Document.[DOCTYPE_USER_DATA | DOCTYPE_LAND_DATA | DOCTYPE_VOTE_DATA]
     * @param {string} documentId Suffix - user: cui, land: cli, vote: cvi 
     * @returns {Info} Info
     */
    info(docType, documentId) {
        return new Info(docType, documentId);
    }

    /**
     * Returns UserStatistics with hp, strength, agility, dexterity, charisma, intelligence, and vital.
     * @param {Number} hp
     * @param {Number} strength 
     * @param {Number} agility 
     * @param {Number} dexterity 
     * @param {Number} charisma 
     * @param {Number} intelligence 
     * @param {Number} vital 
     * @returns {UserStatistics} UserStatistics
     */
    userStatistics(hp, strength, agility, dexterity, charisma, intelligence, vital) {
        return new UserStatistics(hp, strength, agility, dexterity, charisma, intelligence, vital);
    }

    /**
     * Returns UserDocument with info, owner, gold, bankGold and userStatistics.
     * @param {Info} info 
     * @param {string} owner 
     * @param {Number} gold 
     * @param {Number} bankGold 
     * @param {UserStatistics} userStatistics 
     * @returns {UserDocument} UserDocument
     */
    userDocument(info, owner, gold, bankGold, userStatistics) {
        return new UserDocument(info, owner, gold, bankGold, userStatistics);
    }

    /**
     * Returns LandDocument with info, owner, address, area, renter, account, rentDate, and period.
     * @param {Info} info 
     * @param {string} owner 
     * @param {string} address 
     * @param {string} area 
     * @param {string} renter 
     * @param {string} account 
     * @param {string} rentDate 
     * @param {Number} period 
     * @returns {LandDocument} LandDocument
     */
    landDocument(info, owner, address, area, renter, account, rentDate, period) {
        return new LandDocument(info, owner, address, area, renter, account, rentDate, period);
    }

    /**
     * Returns VoteDocument with info, owner, round, endvotetime, candidates, bossname, account and termofoffice.
     * @param {Info} info 
     * @param {string} owner 
     * @param {Number} round 
     * @param {string} endTime endvotetime
     * @param {object} candidates An array of candidates
     * @param {string} bossName 
     * @param {string} account 
     * @param {string} office termofoffice
     * @returns {VoteDocument} VoteDocument
     */
    voteDocument(info, owner, round, endTime, candidates, bossName, account, office) {
        return new VoteDocument(info, owner, round, endTime, candidates, bossName, account, office);
    }

    /**
     * Returns HistoryDocument with info, owner, name, account, date, usage, application.
     * @param {Info} info 
     * @param {string} owner 
     * @param {string} name 
     * @param {string} account 
     * @param {string} date 
     * @param {string} usage 
     * @param {string} app application 
     * @returns {HistoryDocument} HistoryDocument
     */
    historyDocument(info, owner, name, account, date, usage, app) {
        return new HistoryDocument(info, owner, name, account, date, usage, app);
    }

    /**
     * Returns BlockCityItem for create-documents.
     * @param {Document} document 
     * @param {string} currencyId 
     * @returns {BlockCityItem} BlockCityItem
     */
    getCreateDocumentsItem(document, currencyId) {
        return new BlockCityItem(MBC_CREATE_DOCUMENTS_ITEM, document.docType, document, currencyId);
    }

    /**
     * Returns BlockCityItem for update-documents.
     * @param {Document} document
     * @param {string} currencyId 
     * @returns {BlockCityItem} BlockCityItem
     */
    getUpdateDocumentsItem(document, currencyId) {
        return new BlockCityItem(MBC_UPDATE_DOCUMENTS_ITEM, document.docType, document, currencyId);
    }

    /**
     * Returns BlockCityFact for create-documents.
     * @param {string} sender
     * @param {object} items An array of BlockCityItem 
     * @returns {BlockCityFact} BlockCityFact
     */
    getCreateDocumentsFact(sender, items) {
        return new BlockCityFact(MBC_CREATE_DOCUMENTS_OP_FACT, sender, items);
    }

    /**
     * Returns BlockCityFact for update-documents.
     * @param {string} sender 
     * @param {object} items 
     * @returns {BlockCityFact} BlockCityFact
     */
    getUpdateDocumentsFact(sender, items) {
        return new BlockCityFact(MBC_UPDATE_DOCUMENTS_OP_FACT, sender, items);
    }
};


module.exports = {
    BlockCityGenerator,
};