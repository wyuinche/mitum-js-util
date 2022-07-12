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

const { CollectionRegisterForm, MintForm, NFTSigner, NFTSigners } = require("./base");
const { MintItem, NFTTransferItem, BurnItem, ApproveItem, DelegateItem, NFTSignItem } = require("./item");
const { CollectionRegisterFact, MintFact, NFTTransferFact, BurnFact, ApproveFact, DelegateFact, NFTSignFact } = require("./fact");

// generator
const { OperationGenerator } = require("../base");


/**
 * @class
 * @extends OperationGenerator
 * NFTGenerator supports generating data and json files for the nft model to be sent to the mitum network.
 * You must set the network ID before using the generator method.
 * @property {string} id
 */
class NFTGenerator extends OperationGenerator {

    /**
     * Returns NFTSigner generated from account address, share, and signed.
     * @param {string} account Account Address
     * @param {number} share Share
     * @param {bool} signed 
     * @returns {NFTSigner} NFTSigner
     */
    signer(account, share, signed) {
        return new NFTSigner(account, share, signed);
    }

    /**
     * Returns NFTSigners generated from total shares and signers.
     * @param {number} total Total Shares
     * @param {object} _signers signers
     * @returns {NFTSigners} NFTSigners
     */
    signers(total, _signers) {
        return new NFTSigners(total, _signers);
    }

    /**
     * Returns CollectionRegisterForm generated from target contract account, symbol, name, royalty, and uri.
     * @param {string} target Target Contract Account
     * @param {string} symbol Collection Symbol
     * @param {string} name Collection name
     * @param {number} royalty Royalty
     * @param {string} uri Collection URI
     * @param {object} whites Whitelist
     * @returns {CollectionRegisterForm} CollectionRegisterForm
     */
    collectionRegisterForm(target, symbol, name, royalty, uri, whites) {
        return new CollectionRegisterForm(target, symbol, name, royalty, uri, whites);
    }

    /**
     * Returns MintForm generated from nft hash, nft uri, creators, and copyrighters.
     * @param {string} hash NFT Hash
     * @param {string} uri NFT URI
     * @param {NFTSigners} creators Creators
     * @param {NFTSigners} coyrighters Copyrighters
     * @returns {MintForm} MintForm
     */
    mintForm(hash, uri, creators, copyrighters) {
        return new MintForm(hash, uri, creators, copyrighters);
    }

    /**
     * Returns MintForm generated from collection, form, and currency id.
     * @param {string} collection Collection Symbol
     * @param {MintForm} form MintForm
     * @param {string} cid Currency ID
     * @returns {MintItem} MintItem
     */
    getMintItem(collection, form, cid) {
        return new MintItem(collection, form, cid);
    }

    /**
     * Returns NFTTransferItem generated from receiver, nft id and currency id.
     * @param {string} receiver Receiver
     * @param {string} nid NFT ID
     * @param {string} cid Currency ID
     * @returns {NFTTransferItem} NFTTransferItem
     */
    getTransferItem(receiver, nid, cid) {
        return new NFTTransferItem(receiver, nid, cid);
    }

    /**
     * Returns BurnItem generated from nft id and currency id.
     * @param {string} nid NFT ID
     * @param {string} cid Currency ID
     * @returns {BurnItem} BurnITem
     */
    getBurnItem(nid, cid) {
        return new BurnItem(nid, cid);
    }

    /**
     * Returns ApproveItem generated from approved account, nft id and currency id.
     * @param {string} approved Approved Account
     * @param {string} nid NFT ID
     * @param {string} cid Currency ID
     * @returns {ApproveItem} ApproveItem
     */
    getApproveItem(approved, nid, cid) {
        return new ApproveItem(approved, nid, cid);
    }

    /**
     * Returns DelegateItem generated from collection symbol, agent account, delegate mode, and currency id.
     * @param {string} collection Collection Symbol
     * @param {string} agent Agent Account
     * @param {string} mode Delegate Mode
     * @param {string} cid Currency ID
     * @returns {DelegateItem} DelegateItem
     */
    getDelegateItem(collection, agent, mode, cid) {
        return new DelegateItem(collection, agent, mode, cid);
    }

    /**
     * Returns NFTSignItem generated from signer qualification, nft id, and currency id.
     * @param {string} qualification Qualification
     * @param {string} nid NFT ID
     * @param {string} cid Currency ID
     * @returns {NFTSignItem} NFTSignItem
     */
    getSignItem(qualification, nid, cid) {
        return new NFTSignItem(qualification, nid, cid);
    }

    /**
     * Returns CollectionRegisterFact generated from sender, collection register form, and currency id.
     * @param {string} sender Sender
     * @param {CollectionRegisterForm} form CollectionRegisterForm
     * @param {string} cid Currency ID
     * @returns {CollectionRegisterFact} CollectionRegisterFact
     */
    getCollectionRegisterFact(sender, form, cid) {
        return new CollectionRegisterFact(sender, form, cid);
    }

    /**
     * Returns MintFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of MintItem
     * @returns {MintFact} MintFact
     */
    getMintFact(sender, items) {
        return new MintFact(sender, items);
    }

    /**
     * Returns NFTTransferFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of NFTTransferItem
     * @returns {NFTTransferFact} NFTTransferFact
     */
    getTransferFact(sender, items) {
        return new NFTTransferFact(sender, items);
    }

    /**
     * Returns BurnFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of BurnItem
     * @returns {BurnFact} BurnFact
     */
    getBurnFact(sender, items) {
        return new BurnFact(sender, items);
    }

    /**
     * Returns ApproveFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of ApproveItem
     * @returns {ApproveFact} ApproveFact
     */
    getApproveFact(sender, items) {
        return new ApproveFact(sender, items);
    }

    /**
     * Returns DelegateFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of DelegateItem
     * @returns {DelegateFact} DelegateFact
     */
    getDelegateFact(sender, items) {
        return new DelegateFact(sender, items);
    }

    /**
     * Returns NFTSignFact generated from sender and items.
     * @param {string} sender Sender
     * @param {object} items List of NFTSignItem
     * @returns {NFTSignFact} NFTSignFact
     */
    getSignFact(sender, items) {
        return new NFTSignFact(sender, items);
    }
};


module.exports = {
    NFTGenerator,
};