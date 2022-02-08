const { Generator, JSONParser } = require('./lib/generator');
const { Signer } = require('./lib/sign');

const { getNewKeypair, getKeypairFromPrivateKey, getKeypairFromSeed } = require('./lib/key');

const { BLOCKSIGN_CREATE_DOCUMENTS, BLOCKSIGN_SIGN_DOCUMENTS } = require('./lib/operation/blocksign');
const BlockSignType = {
    BLOCKSIGN_CREATE_DOCUMENTS,
    BLOCKSIGN_SIGN_DOCUMENTS,
};

const { DOCTYPE_USER_DATA, DOCTYPE_LAND_DATA, DOCTYPE_VOTE_DATA } = require('./lib/operation/blockcity');
const BlockCityDocType = {
    DOCTYPE_USER_DATA,
    DOCTYPE_LAND_DATA,
    DOCTYPE_VOTE_DATA
};

module.exports = {
    Generator,
    JSONParser,
    Signer,
    
    getNewKeypair,
    getKeypairFromPrivateKey,
    getKeypairFromSeed,
    
    BlockSignType,
    BlockCityDocType,
};