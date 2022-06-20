/*
    mitum-js-util SDK for mitum-currency, mitum-document
    Copyright (C) 2021-2022 ProtoconNet

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

// util
const { getTimeStamp, dateToUTC, sum256, _hint } = require('../util');

// generator
const { CurrencyGenerator } = require('../operation/currency');
const { DocumentGenerator } = require('../operation/document/generator');
const { FeeFiGenerator } = require('../operation/feefi/generator');

// hint
const { SEAL } = require('../hint');

// operation
const { Operation, OperationFact } = require('../operation');

// key
const { getKeypairFromPrivateKey } = require('../key');

// encode
const bs58 = require('bs58');


/**
 * @class
 * Generator supports generating data and json files to be sent to the mitum network.
 * You must set the network ID before using the generator method.
 * @property {string} id
 * @property {CurrencyGenerator} mc deprecated; use Generator.currency
 * @property {DocumentGenerator} md deprecated; use Generator.document
 * @property {CurrencyGenerator} currency
 * @property {DocumentGenerator} document
 * @property {FeeFiGenerator} feefi
 */
class Generator {

    /**
     * Generator instance with network id.
     * @param {string} id Network ID 
     */
    constructor(id) {
        this.id = id;

        this.currency = new CurrencyGenerator(id);
        this.document = new DocumentGenerator(id);
        this.feefi = new FeeFiGenerator(id);

        this.mc = this.currency;
        this.md = this.document;
    }

    /**
     * Sets a new network ID.
     * @param {string} id New network ID
     */
    setId(id) {
        this.id = id;

        this.currency.setId(id);
        this.document.setId(id);
        this.feefi.setId(id);

        this.mc = this.currency;
        this.md = this.document;
    }

    /**
     * Returns Operation generated from fact and memo.
     * Memo can be left blanck.
     * @param {OperationFact} fact OperationFact created by Generator.get{*}Fact
     * @param {string} memo Memo
     * @returns {Operation} Operation
     */
    getOperation(fact, memo) {
        return new Operation(
            this.id, fact.operationHint, memo, fact
        );
    };

    /**
     * Returns the seal generated from signing key and operations.
     * @param {string} sk Private key with suffix (mpr)
     * @param {object} operations List of Operation created by Generator.createOperation
     * @returns {object} Dictionary type seal object
     */
    getSeal(sk, operations) {
        const keypair = getKeypairFromPrivateKey(sk);
        const signedAt = getTimeStamp();
        const bSignedAt = Buffer.from(dateToUTC(signedAt));
        const bSigner = Buffer.from(keypair.getPublicKey());
        const bOperations = Buffer.concat(operations.map(x => x.hash))

        const bodyHash = sum256(
            Buffer.concat([bSigner, bSignedAt, bOperations]));

        const signature = keypair.sign(
            Buffer.concat(
                [bodyHash, Buffer.from(this.id)]
            )
        );

        const hash = sum256(
            Buffer.concat([bodyHash, signature])
        );

        const seal = {};
        seal._hint = _hint(SEAL);
        seal.hash = bs58.encode(hash);
        seal.body_hash = bs58.encode(bodyHash);
        seal.signer = keypair.getPublicKey();
        seal.signature = bs58.encode(signature);
        seal.signed_at = signedAt.toISOString();
        seal.operations = operations.map(x => x.dict());

        return seal;
    };
};


module.exports = {
    Generator,
};