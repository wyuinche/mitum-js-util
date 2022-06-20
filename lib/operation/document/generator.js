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

const { BlockCityGenerator } = require("./blockcity");
const { BlockSignGenerator } = require("./blocksign");
const { CreateDocumentsFact, UpdateDocumentsFact } = require("./fact");
const { CreateDocumentsItem, UpdateDocumentsItem } = require("./item");

// generator
const { OperationGenerator } = require("../base");


/**
 * @class
 * @extends OperationGenerator
 * DocumentGenerator supports generating data and json files for the document model to be sent to the mitum network.
 * You must set the network ID before using the generator method.
 * It helps generate operations for the document model - blockcity and blocksign.
 * @property {string} id
 * @property {BlockCityGenerator} bc deprecated; use DocumentGenerator.blockcity
 * @property {BlockSignGenerator} bs deprecated; use DocumentGenerator.blocksign
 * @property {BlockCityGenerator} blockcity 
 * @property {BlockSignGenerator} blocksign 
 */
class DocumentGenerator extends OperationGenerator {

    /**
     * Generator instance with network id.
     * @param {string} id Network ID 
     */
    constructor(id) {
        super(id);

        this.blockcity = new BlockCityGenerator(id);
        this.blocksign = new BlockSignGenerator(id);

        this.bc = this.blockcity;
        this.bs = this.blocksign;
    }

    /**
     * Sets a new network ID.
     * @param {string} id New network ID
     */
    setId(id) {
        this.id = id;

        this.blockcity.setId(id);
        this.blocksign.setId(id);

        this.bc = this.blockcity;
        this.bs = this.blocksign;
    }

    /**
     * Returns CreateDocumentsItem generated from document and currency id.
     * @param {Document} document Document
     * @param {string} cid Currency ID
     * @returns {CreateDocumentsItem} CreateDocumentsItem
     */
    getCreateDocumentsItem(document, cid) {
        return new CreateDocumentsItem(document, cid);
    }

    /**
     * Returns UpdateDocumentsItem generated from document and currency id.
     * @param {Document} document Document
     * @param {string} cid Currency ID
     * @returns {UpdateDocumentsItem} UpdateDocumentsItem
     */
    getUpdateDocumentsItem(document, cid) {
        return new UpdateDocumentsItem(document, cid);
    }

    /**
     * Returns CreateDocumentsFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of CreateDocumentsItem
     * @returns {CreateDocumentsFact} CreateDocumentsFact
     */
    getCreateDocumentsFact(sender, items) {
        return new CreateDocumentsFact(sender, items);
    }

    /**
     * Returns UpdateDocumentsItem generated from sender and items.
     * @param {string} sender Sender 
     * @param {object} items List of UpdateDocumentsItem
     * @returns {UpdateDocumentsFact} UpdateDocumentsFact
     */
    getUpdateDocumentsFact(sender, items) {
        return new UpdateDocumentsFact(sender, items);
    }
}


module.exports = {
    DocumentGenerator,
};