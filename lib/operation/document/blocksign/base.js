/*
    mitum-js-util SDK for mitum-currency, mitum-document
    Copyright (C) 2022 ProtoconNet

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { MBS_DOCTYPE_DOCUMENT_DATA } = require("../../../hint");
const { Address } = require("../../../key");
const { _hint } = require("../../../util");


class BlockSignUser {
    constructor(address, signCode, signed) {
        this.hint = _hint(MBS_DOCTYPE_DOCUMENT_DATA);
        this.address = new Address(address);
        this.signCode = signCode;
        this.signed = signed;
    }

    buffer() {
        const bAddress = this.address.buffer();
        const bSignCode = Buffer.from(this.signCode);
        const bSigned = Buffer.alloc(1);
        bSigned[0] = this.signed ? 1 : 0;

        return Buffer.concat([bAddress, bSignCode, bSigned]);
    }

    dict() {
        const user = {};

        user._hint = this.hint;
        user.address = this.address.typed();
        user.signCode = this.signCode;
        user.signed = this.signed;
        
        return user;
    }

    compare(x, y) {
        return Buffer.compare(x.address.buffer(), y.address.buffer());
    };
}


module.exports = {
    BlockSignUser,
};