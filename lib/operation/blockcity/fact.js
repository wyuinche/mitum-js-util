const { OperationFact } = require("..");
const { concatObjectsToBuffer } = require("../../util");

class BlockCityFact extends OperationFact {
    constructor(type, sender, items) {
        super(type);

        this.sender = new Address(sender);
        this.items = items;

        this._generateHash();
    }

    buffer() {
        const bToken = Buffer.from(this.token.toISOString());
        const bSender = this.sender.buffer();
        const bItems = concatObjectsToBuffer(this.items);

        return Buffer.concat([bToken, bSender, bItems]);
    }

    dict() {
        
    }
}