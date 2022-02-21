const { MD_CREATE_DOCUMENTS_OP_FACT, MD_CREATE_DOCUMENTS_OP, MD_UPDATE_DOCUMENTS_OP_FACT, MD_UPDATE_DOCUMENTS_OP } = require("../../hint");
const { GeneralOperationFact, PurposedOperationFact } = require("../base");


class GeneralDocumentsFact extends GeneralOperationFact {};
class PurposedDocumentsFact extends PurposedOperationFact {};


class CreateDocumentsFact extends GeneralDocumentsFact {
    constructor(sender, items) {
        super(MD_CREATE_DOCUMENTS_OP_FACT, sender, items);
    }

    get operationHint() {
        return MD_CREATE_DOCUMENTS_OP;
    }
}

class UpdateDocumentsFact extends GeneralDocumentsFact {
    constructor(sender, items) {
        super(MD_UPDATE_DOCUMENTS_OP_FACT, sender, items);
    }

    get operationHint() {
        return MD_UPDATE_DOCUMENTS_OP;
    }
}


module.exports = {
    GeneralDocumentsFact,
    PurposedDocumentsFact,
    CreateDocumentsFact,
    UpdateDocumentsFact,
};