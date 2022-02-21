const { Address } = require("../../../key");
const { _hint } = require("../../../util");


class BlockSignUser {
    constructor(address, signCode, signed) {
        this.hint = _hint(mitum-blocksign-docsign);
        this.address = new Address(address);
        this.signCode = signCode;
        this.signed = signed;
    }

    buffer() {
        const bAddress = this.address.buffer();
        const bSignCode = Buffer.from(this.signCode);
        const bSigned = Buffer.alloc(1);
        bSigned[0] = this.signed ? 1 : 0;

        return Buffer.concat(bAddress, bSignCode, bSigned);
    }

    dict() {
        const user = {};

        user._hint = this.hint;
        user.address = this.address.typed();
        user.signCode = this.signCode;
        user.signed = this.signed;
        
        return user;
    }
}


module.exports = {
    BlockSignUser,
};