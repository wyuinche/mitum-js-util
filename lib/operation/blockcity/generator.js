const { MBC_CREATE_DOCUMENTS_ITEM, MBC_UPDATE_DOCUMENTS_ITEM, MBC_CREATE_DOCUMENTS_OP_FACT, MBC_UPDATE_DOCUMENTS_OP_FACT } = require("../../hint");
const { OperationGenerator } = require("../base");
const { Candidate, Info, UserStatistics } = require("./base");
const { UserDocument, LandDocument, VoteDocument } = require("./document");
const { BlockCityItem } = require("./item");

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
        return new BlockCItyFact(MBC_UPDATE_DOCUMENTS_OP_FACT, sender, items);
    }
};


module.exports = {
    BlockCityGenerator,
};