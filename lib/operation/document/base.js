const { MBC_DOCUMENT_INFO } = require("../../hint");
const { parseDocumentId, BigInteger } = require("../../util");


class DocumentId {
    constructor(documentId) {
        const parsed = parseDocumentId(documentId);
        this._id = parsed.id;
        this._type = parsed.suffix;
    }

    get documentId() {
        return this._id + this._type;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    buffer() {
        return Buffer.from(this.documentId);
    }
}


class Info {
    constructor(docType, documentId) {
        this.hint = _hint(MBC_DOCUMENT_INFO);
        this.docType = docType;
        this.documentId = new DocumentId(documentId);
    }

    getIdHint() {
        throw "[ERROR] Unimplemented function getIdHint(); Info";
    }

    buffer() {
        const bDocumentId = this.documentId.buffer();
        const bDocType = Buffer.from(this.docType);
        return Buffer.concat([bDocumentId, bDocType]);
    }

    dict() {
        const docId = {};

        docId._hint = this.getIdHint();
        docId.id = this.documentId.documentId;

        const info = {};

        info._hint = this.hint;
        info.docid = docId;
        info.doctype = this.docType;

        return info;
    }
}


class Document {
    constructor(info, owner) {
        this.hint = _hint(info.docType);
        this.info = info;
        this.owner = new Address(owner);
    }

    buffer() {
        throw '[ERROR] Unimplemented function buffer(); Document';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict(); Document';
    }
}


module.exports = {
    DocumentId,
    Info,
    Document,
};