const { Generator, JSONParser } = require('./lib/generator');
const { Signer } = require('./lib/sign');

const { getNewKeypair, getKeypairFromPrivateKey, getKeypairFromSeed } = require('./lib/key');

const { BLOCKSIGN_CREATE_DOCUMENTS, BLOCKSIGN_SIGN_DOCUMENTS, BLOCKSIGN_TRANSFER_DOCUMENTS } = require('./lib/operation/blocksign');
const BlockSignType = {
    BLOCKSIGN_CREATE_DOCUMENTS,
    BLOCKSIGN_SIGN_DOCUMENTS,
    BLOCKSIGN_TRANSFER_DOCUMENTS
};

module.exports = {
    Generator,
    JSONParser,
    Signer,
    
    getNewKeypair,
    getKeypairFromPrivateKey,
    getKeypairFromSeed,
    
    BlockSignType,
};