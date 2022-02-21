const { OperationGenerator } = require("../../base");
const { BlockSignUser } = require("./base");
const { BlockSignDocument } = require("./doc");
const { SignDocumentsFact } = require("./fact");
const { SignDocumentsItem } = require("./item");


class BlockSignGenerator extends OperationGenerator {

    user(address, signCode, signed) {
        return new BlockSignUser(address, signCode, signed);
    }

    document(docId, owner, filehash, creator, title, size, signers) {
        return new BlockSignDocument(docId, owner, filehash, creator, title, size, signers);
    }
    
    getSignDocumentsItem(docId, owner, currencyId) {
        return new SignDocumentsItem(docId, owner, currencyId);
    }

    getSignDocumentsFact(sender, items) {
        return new SignDocumentsFact(sender, items);
    }
};


module.exports = {
    BlockSignGenerator
};