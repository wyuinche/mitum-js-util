const { MD_CREATE_DOCUMENTS_ITEM, MD_UPDATE_DOCUMENTS_ITEM } = require("../../hint");
const { Item } = require("../base");


class DocumentsItem extends Item {};


class GeneralDocumentsItem extends DocumentsItem {
    constructor(type, document, currencyId) {
        super(type);

        this.document = document;
        this.currencyId = currencyId;
    }

    buffer() {
        const bDocument = this.document.buffer();
        const bCurrencyId = Buffer.from(this.currencyId);
        return Buffer.concat([bDocType, bDocument, bCurrencyId]);
    }

    dict() {
        const item = {};

        item._hint = this.hint;
        item.doc = this.document.dict();
        item.currency = this.currencyId;

        return item;
    }
}


class PurposedDocumentsItem extends DocumentsItem {};


class CreateDocumentsItem extends GeneralDocumentsItem {
    constructor(document, currencyId) {
        super(MD_CREATE_DOCUMENTS_ITEM, document, currencyId);
    }
}


class UpdateDocumentsItem extends GeneralDocumentsItem {
    constructor(document, currencyId) {
        super(MD_UPDATE_DOCUMENTS_ITEM, document, currencyId);
    }
}


module.exports = {
    GeneralDocumentsItem,
    PurposedDocumentsItem,
    CreateDocumentsItem,
    UpdateDocumentsItem,
};