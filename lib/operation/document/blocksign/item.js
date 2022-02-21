const { MBS_SIGN_ITEM_SINGLE_DOCUMENT } = require("../../../hint");
const { PurposedDocumentsItem } = require("../item");


class SignDocumentsItem extends PurposedDocumentsItem {
    constructor(docId, owner, currencyId) {
        super(MBS_SIGN_ITEM_SINGLE_DOCUMENT);
    
        this.docId = docId;
        this.owner = new Address(owner);
        this.currencyId = currencyId;
    }

    buffer() {

    }

    dict() {
        
    }       
}


module.exports = {
    SignDocumentsItem,
};