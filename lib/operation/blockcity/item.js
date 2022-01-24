const { Item } = require("../base");

class BlockCityItem extends Item {
    constructor(type, docType, document, currencyId) {
        super(type);

        this.docType = docType;
        this.document = document;
        this.currencyId = currencyId;
    }

    buffer() {
        const bDocType = this.docType.encode();
        const bDocument = this.document.buffer();
        const bCurrencyId = this.currencyId.encode();
        return Buffer.concat([bDocType, bDocument, bCurrencyId]);
    }

    dict() {

    }
}

module.exports = {
    BlockCityItem
};