const { MBS_SIGN_DOCUMENTS_OP_FACT, MBS_SIGN_DOCUMENTS_OP } = require("../../../hint");
const { GeneralDocumentsFact } = require("../fact");


class SignDocumentsFact extends GeneralDocumentsFact {
    constructor(sender, items) {
        super(MBS_SIGN_DOCUMENTS_OP_FACT, sender, items);
    }

    get operationHint() {
        return MBS_SIGN_DOCUMENTS_OP;
    }
}


module.exports = {
    SignDocumentsFact,
};