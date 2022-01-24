const { MBC_DOCUMENT_INFO, MBC_VOTING_CANDIDATE, MBC_USER_STATISTICS } = require("../../hint");
const { Address } = require("../../key");
const { _hint, parseDocumentId, BigInteger } = require("../../util");

class DocumentId {
    constructor(documentId) {
        const parsed = parseDocumentId(documentId);
        this.id = new BigInteger(parsed.id);
        this.type = parsed.suffix;
    }

    get documentId() {
        return this.id.rawValue + this.type;
    }

    get id() {
        return this.id.rawValue;
    }

    get type() {
        return this.type;
    }

    buffer() {
        return this.documentId.encode();
    }
}

class Info {
    constructor(docType, documentId) {
        this.hint = _hint(MBC_DOCUMENT_INFO);
        this.docType = docType;
        this.documentId = new DocumentId(documentId);
    }

    buffer() {
        const bDocumentId = this.buffer();
        const bDocType = this.docType.encode();
        return Buffer.concat([bDocumentId, bDocType]);
    }

    dict() {

    }
}

class Candidate {
    constructor(address, manifest) {
        if(manifest.length > 100) {
            throw '[ERROR] manifest length is over 100! (manifest.length <= 100)';
        }

        this.hint = _hint(MBC_VOTING_CANDIDATE);
        this.address = new Address(address);
        this.manifest = manifest;
    }

    buffer() {
        const bAddress = this.address.buffer();
        const bManifest = this.manifest.encode();
        return Buffer.concat([bAddress, bManifest]);
    }

    dict() {

    }
}

class UserStatistics {
    constructor(hp, str, agi, dex, cha, intel, vital) {
        this.hint = _hint(MBC_USER_STATISTICS);

        this.hp = new BigInteger("" + hp);
        this.str = new BigInteger("" + str);
        this.agi = new BigInteger("" + agi);
        this.dex = new BigInteger("" + dex);
        this.cha = new BigInteger("" + cha);
        this.intel = new BigInteger("" + intel);
        this.vital = new BigInteger("" + vital);
    }

    buffer() {
        return Buffer.concat([
            this.hp.buffer(),
            this.str.buffer(),
            this.agi.buffer(),
            this.dex.buffer(),
            this.cha.buffer(),
            this.intel.buffer(),
            this.vital.buffer(),
        ]);
    }

    dict() {

    }
}

module.exports = {
    Info,
    Candidate,
    UserStatistics
};