const { OperationGenerator } = require("../base");

const { BlockCityGenerator } = require("./blockcity/generator");
const { BlockSignGeneralInfo } = require("./blocksign/info");
const { CreateDocumentsFact, UpdateDocumentsFact } = require("./fact");
const { CreateDocumentsItem, UpdateDocumentsItem } = require("./item");


class DocumentGenerator extends OperationGenerator {

    constructor(id) {
        super(id);

        this.bc = new BlockCityGenerator(id);
        this.bs = new BlockSignGeneralInfo(id);
    }

    setId(id) {
        this.id = id;

        this.bc = new BlockCityGenerator(id);
        this.bs = new BlockSignGeneralInfo(id);
    }

    getCreateDocumentsItem(document, currencyId) {
        return new CreateDocumentsItem(document, currencyId);
    }

    getUpdateDocumentsItem(document, currencyId) {
        return new UpdateDocumentsItem(document, currencyId);
    }

    getCreateDocumentsFact(sender, items) {
        return new CreateDocumentsFact(sender, items);
    }

    getUpdatedocumentsFact(sender, items) {
        return new UpdateDocumentsFact(sender, items);
    }
}


module.exports = {
    DocumentGenerator,
};