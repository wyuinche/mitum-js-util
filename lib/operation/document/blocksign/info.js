const { Info } = require("../base");
const { MBS_DOCUMENT_DATA, MD_DOCUMENT_ID } = require("../../../hint");


class BlockSignInfo extends Info {
    getIdHint() {
        switch (this.docType) {
            case MBS_DOCUMENT_DATA:
                return _hint(MD_DOCUMENT_ID);
            default:
                throw '[ERROR] Invalid document type for Info.dict()';
        }
    }
}


class BlockSignGeneralInfo extends BlockSignInfo {
    constructor(docId) {
        super(MBS_DOCUMENT_DATA, docId);
    }
};


module.exports = {
    BlockSignGeneralInfo,
};