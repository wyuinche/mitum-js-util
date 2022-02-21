const { OperationGenerator } = require("../../base");
const { Candidate, UserStatistics } = require("./base");
const { UserDocument, LandDocument, VoteDocument, HistoryDocument } = require("./doc");


class BlockCityGenerator extends OperationGenerator {
    /**
     * Returns Candidate object with address, nickname and manifest. 
     * @param {string} address Address
     * @param {string} nickname Nickname
     * @param {string} manifest Manifest
     * @param {number} count Count
     * @returns {Candidate} Candidate
     */
    candidate(address, nickname, manifest, count) {
        return new Candidate(address, nickname, manifest, count);
    }

    /**
     * Returns UserStatistics with hp, strength, agility, dexterity, charisma, intelligence, and vital.
     * @param {number} hp
     * @param {number} strength 
     * @param {number} agility 
     * @param {number} dexterity 
     * @param {number} charisma 
     * @param {number} intelligence 
     * @param {number} vital 
     * @returns {UserStatistics} UserStatistics
     */
    userStatistics(hp, strength, agility, dexterity, charisma, intelligence, vital) {
        return new UserStatistics(hp, strength, agility, dexterity, charisma, intelligence, vital);
    }

    /**
     * Returns UserDocument with info, owner, gold, bankGold and userStatistics.
     * @param {string} docId DocumentId 
     * @param {string} owner 
     * @param {number} gold 
     * @param {number} bankGold 
     * @param {UserStatistics} userStatistics 
     * @returns {UserDocument} UserDocument
     */
    userDocument(docId, owner, gold, bankGold, userStatistics) {
        return new UserDocument(docId, owner, gold, bankGold, userStatistics);
    }

    /**
     * Returns LandDocument with info, owner, address, area, renter, account, rentDate, and period.
     * @param {string} docId DocumentId 
     * @param {string} owner 
     * @param {string} address 
     * @param {string} area 
     * @param {string} renter 
     * @param {string} account 
     * @param {string} rentDate 
     * @param {number} period 
     * @returns {LandDocument} LandDocument
     */
    landDocument(docId, owner, address, area, renter, account, rentDate, period) {
        return new LandDocument(docId, owner, address, area, renter, account, rentDate, period);
    }

    /**
     * Returns VoteDocument with info, owner, round, endvotetime, candidates, bossname, account and termofoffice.
     * @param {string} docId DocumentId 
     * @param {string} owner 
     * @param {number} round 
     * @param {string} endTime endvotetime
     * @param {object} candidates An array of candidates
     * @param {string} bossName 
     * @param {string} account 
     * @param {string} office termofoffice
     * @returns {VoteDocument} VoteDocument
     */
    voteDocument(docId, owner, round, endTime, candidates, bossName, account, office) {
        return new VoteDocument(docId, owner, round, endTime, candidates, bossName, account, office);
    }

    /**
     * Returns HistoryDocument with info, owner, name, account, date, usage, application.
     * @param {string} docId DocumentId 
     * @param {string} owner 
     * @param {string} name 
     * @param {string} account 
     * @param {string} date 
     * @param {string} usage 
     * @param {string} app application 
     * @returns {HistoryDocument} HistoryDocument
     */
    historyDocument(docId, owner, name, account, date, usage, app) {
        return new HistoryDocument(docId, owner, name, account, date, usage, app);
    }
}


module.exports = {
    BlockCityGenerator
};