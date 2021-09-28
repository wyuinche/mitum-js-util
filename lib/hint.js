/*
    mitum-js-util SDK for mitum-currency and mitum-data-blocksign
    Copyright (C) 2021 ProtoconNet

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

/* mitum-currency hint */
exports.MC_ADDRESS = "mca";
exports.MC_TRANSFERS_OP_FACT = "mitum-currency-transfers-operation-fact";
exports.MC_TRANSFERS_OP = "mitum-currency-transfers-operation";
exports.MC_KEY = "mitum-currency-key";
exports.MC_KEYS = "mitum-currency-keys";
exports.MC_CREATE_ACCOUNTS_OP_FACT = "mitum-currency-create-accounts-operation-fact";
exports.MC_CREATE_ACCOUNTS_OP = "mitum-currency-create-accounts-operation";
exports.MC_KEYUPDATER_OP_FACT = "mitum-currency-keyupdater-operation-fact";
exports.MC_KEYUPDATER_OP = "mitum-currency-keyupdater-operation";
exports.MC_FEE_OP_FACT = "mitum-currency-fee-operation-fact";
exports.MC_FEE_OP = "mitum-currency-fee-operation";
exports.MC_ACCOUNT = "mitum-currency-account";
exports.MC_NODE_INFO = "mitum-currency-node-info";
exports.MC_HAL = "mitum-currency-hal";
exports.MC_PROBLEM = "mitum-currency-problem";
exports.MC_ACCOUNT_VALUE = "mitum-currency-account-value";
exports.MC_OP_VALUE = "mitum-currency-operation-value";
exports.MC_GENESIS_CURRENCIES_OP_FACT = "mitum-currency-genesis-currencies-operation-fact";
exports.MC_GENESIS_CURRENCIES_OP = "mitum-currency-genesis-currencies-operation";
exports.MC_AMOUNT = "mitum-currency-amount";
exports.MC_AMOUNT_STATE = "mitum-currency-amount-state";
exports.MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS = "mitum-currency-create-accounts-multiple-amounts";
exports.MC_CREATE_ACCOUNTS_SINGLE_AMOUNT = "mitum-currency-create-accounts-single-amount";
exports.MC_TRANSFERS_ITEM_MULTI_AMOUNTS = "mitum-currency-transfers-item-multi-amounts";
exports.MC_TRNASFERS_ITEM_SINGLE_AMOUNT = "mitum-currency-transfers-item-single-amount";
exports.MC_CURRENCY_REGISTER_OP_FACT = "mitum-currency-currency-register-operation-fact";
exports.MC_CURRENCY_REGISTER_OP = "mitum-currency-currency-register-operation";
exports.MC_CURRENCY_DESIGN = "mitum-currency-currency-design";
exports.MC_NIL_FEEER = "mitum-currency-nil-feeer";
exports.MC_FIXED_FEEER = "mitum-currency-fixed-feeer";
exports.MC_RATIO_FEEER = "mitum-currency-ratio-feeer";
exports.MC_CURRENCY_POLICY_UPDATER_OP_FACT = "mitum-currency-currency-policy-updater-operation-fact";
exports.MC_CURRENCY_POLICY_UPDATER_OP = "mitum-currency-currency-policy-updater-operation";
exports.MC_CURRENCY_POLICY = "mitum-currency-currency-policy";

/* mitum hint */
exports.JSON = "json-encoder0101";
exports.BSON = "bson-encoder";
exports.STRING_ADDRESS = "sa";
exports.STELLAR_PRIVKEY = "stellar-priv";
exports.STELLAR_PBLCKEY = "stellar-pub";
exports.BTC_PRIVKEY = "btc-priv";
exports.BTC_PBLCKEY = "btc-pub";
exports.ETHER_PRIVKEY = "ether-priv";
exports.ETHER_PBLCKEY = "ether-pub";
exports.INIT_BALLOT = "init-ballot";
exports.PROPOSAL = "proposal";
exports.SIGN_BALLOT = "sign-ballot";
exports.ACCEPT_BALLOT = "accept-ballot";
exports.INIT_BALLOT_FACT = "init-ballot-fact";
exports.PROPOSAL_FACT = "proposal-fact";
exports.SIGN_BALLOT_FACT = "sign-ballot-fact";
exports.ACCEPT_BALLOT_FACT = "accept-ballot-fact";
exports.VOTEPROOF = "voteproof";
exports.BLOCK_V0 = "block";
exports.BLOCK_MANIFEST_V0 = "block-manifest";
exports.BLOCK_CONSENSUS_INFO_V0 = "block-consensus-info";
exports.BLOCK_SUFFRAGE_INFO_V0 = "block-suffrage-info";
exports.BASE_FACT_SIGN = "base-fact-sign";
exports.SEAL = "seal";
exports.BASE_FIXEDTREE_NODE = "base-fixedtree-node";
exports.FIXEDTREE = "fixedtree";
exports.OP_FIXEDTREE_NODE = "operation-fixedtree-node";
exports.BASE_OP_REASON = "base-operation-reason";
exports.STETE_V0 = "stete";
exports.STATE_BYTES_VALUE = "state-bytes-value";
exports.STATE_DURATION_VALUE = "state-duration-value";
exports.STATE_HINTED_VALUE = "state-hinted-value";
exports.STATE_NUMBER_VALUE = "state-number-value";
exports.STATE_SLICE_VALUE = "state-slice-value";
exports.STATE_STRING_VALUE = "state-string-value";
exports.BASE_NODE_V0 = "base-node";
// exports.HASH_BYTES = "0180";
// exports.HASH_SHA256 = "0181";
// exports.HASH_SHA512 = "0182";
exports.NODE_INFO_V0 = "node-info";
exports.LOCALFS_BLOCKDATA = "localfs-blockdata";
exports.BASE_BLOCKDATAMAP = "base-blockdatamap";
exports.BLOCKDATA_WRITER = "blockdata-writer";

exports.PROBLEM = "mitum-problem";

// blocksign hint
exports.MBS_CREATE_DOCUMENTS_SINGLE_FILE = "mitum-blocksign-create-documents-single-file"
exports.MBS_CREATE_DOCUMENTS_OP_FACT = "mitum-blocksign-create-documents-operation-fact"
exports.MBS_CREATE_DOCUMENTS_OP = "mitum-blocksign-create-documents-operation"
exports.MBS_TRANSFER_ITEM_SINGLE_DOCUMENT = "mitum-blocksign-transfer-item-single-document"
exports.MBS_TRANSFER_DOCUMENTS_OP_FACT = "mitum-blocksign-transfer-documents-operation-fact"
exports.MBS_TRANSFER_DOCUMENTS_OP = "mitum-blocksign-transfer-documents-operation"
exports.MBS_SIGN_ITEM_SINGLE_DOCUMENT = "mitum-blocksign-sign-item-single-document"
exports.MBS_SIGN_DOCUMENTS_OP_FACT = "mitum-blocksign-sign-documents-operation-fact"
exports.MBS_SIGN_DOCUMENTS_OP = "mitum-blocksign-sign-documents-operation"