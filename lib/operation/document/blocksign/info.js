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

// util, error
const { _hint } = require("../../../util");
const { ValidationError } = require("../../../errors");

// hint
const { MBS_DOCTYPE_DOCUMENT_DATA, MD_DOCUMENT_ID } = require("../../../hint");

// document
const { Info } = require("../base");


class BlockSignInfo extends Info {
    getIdHint() {
        switch (this.docType) {
            case MBS_DOCTYPE_DOCUMENT_DATA:
                return _hint(MD_DOCUMENT_ID);
            default:
                throw new ValidationError(`doc-type !== ${MD_DOCUMENT_ID} :: BlockSignInfo; Invalid document type.`);
        }
    }
}


class BlockSignGeneralInfo extends BlockSignInfo {
    constructor(docId) {
        super(MBS_DOCTYPE_DOCUMENT_DATA, docId);
    }
};


module.exports = {
    BlockSignGeneralInfo,
};