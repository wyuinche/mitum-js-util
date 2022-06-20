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

const { BlockSignUser } = require("./base");
const { BlockSignDocument } = require("./doc");
const { SignDocumentsFact } = require("./fact");
const { SignDocumentsItem } = require("./item");

// generator
const { OperationGenerator } = require("../../base");


/**
 * @class
 * @extends OperationGenerator
 * BlockSignGenerator supports generating data and json files for the document model - blocksign to be sent to the mitum network.
 * You must set the network ID before using the generator method.
 * @property {string} id
 */
class BlockSignGenerator extends OperationGenerator {

    /**
     * Returns BlockSignUser generated from address, signcode and signed.
     * @param {string} address 
     * @param {string} signCode 
     * @param {boolean} signed 
     * @returns {BlockSignUser} BlockSignUser
     */
    user(address, signCode, signed) {
        return new BlockSignUser(address, signCode, signed);
    }

    /**
     * Returns BlockSignDocument generated from document id, owner, file hash, creator, title, size and signers.
     * The creator and each signer must be BlockSignUser.
     * @param {string} docId Document ID
     * @param {string} owner Owner
     * @param {string} fileHash File hash
     * @param {BlockSignUser} creator Creator
     * @param {string} title Title
     * @param {string} size File Size
     * @param {object} signers Signers
     * @returns {BlockSignDocument} BlockSignDocument
     */
    document(docId, owner, fileHash, creator, title, size, signers) {
        return new BlockSignDocument(docId, owner, fileHash, creator, title, size, signers);
    }
    
    /**
     * Returns SignDocumentsItem generated from document id, owner and currency id.
     * @param {string} docId Document ID
     * @param {string} owner Owner
     * @param {string} cid Currency ID 
     * @returns 
     */
    getSignDocumentsItem(docId, owner, cid) {
        return new SignDocumentsItem(docId, owner, cid);
    }

    /**
     * Returns SignDocumentsFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of SignDocumentsItem
     * @returns {SignDocumentsItem} SignDocumentsItem
     */
    getSignDocumentsFact(sender, items) {
        return new SignDocumentsFact(sender, items);
    }
};


module.exports = {
    BlockSignGenerator
};