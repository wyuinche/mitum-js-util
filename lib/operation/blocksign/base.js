/*
    mitum-js-util SDK for mitum-currency and mitum-data-blocksign
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

const { _hint } = require('../../util');


class BlockSignItem {

    constructor(type) {
        this.hint = _hint(type);
    }

    buffer() {
        throw '[ERROR] Unimplemented function bytes()';
    }

    dict() {
        throw '[ERROR] Unimplemented function dict()';
    }
};


const BLOCKSIGN_CREATE_DOCUMENTS = "CREATE-DOCUMENTS";
const BLOCKSIGN_SIGN_DOCUMENTS = "SIGN_DOCUMENTS";
const BLOCKSIGN_TRANSFER_DOCUMENTS = "TRANSFER_DOCUMENTS";


module.exports = {
    BlockSignItem,
    BLOCKSIGN_CREATE_DOCUMENTS,
    BLOCKSIGN_SIGN_DOCUMENTS,
    BLOCKSIGN_TRANSFER_DOCUMENTS,
};

