const { Document } = require("../base");
const { BlockSignGeneralInfo } = require("./info");


class BlockSignDocument extends Document {
    constructor(docId, owner, fileHash, creator, title, size, signers) {
        super(new BlockSignGeneralInfo(docId), owner);

        this.fileHash = fileHash;
        this.creator = creator;
        this.title = title;
        this.size = size;
        this.signers = signers;
    }

    buffer() {

    }

    dict() {
        const doc = {};

        doc._hint = this.hint;
        doc.info = this.info.dict();
        doc.owner = this.owner.typed();
        doc.fileHash = this.fileHash;
        doc.creator = this.creator.dict();
        doc.title = this.title;
        doc.size = this.size;
        
        doc.signers = this.signers.map(x => x.dict());
    
        return doc;
    }
}


module.exports = {
    BlockSignDocument
};
