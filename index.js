const { Generator, JSONParser, modes } = require('./lib/generator');
const { Signer } = require('./lib/sign');

const { getNewKeypair, getKeypairFromPrivateKey, getKeypairFromSeed } = require('./lib/key');

module.exports = {
    Generator,
    JSONParser,
    Signer,
    modes,
    
    getNewKeypair,
    getKeypairFromPrivateKey,
    getKeypairFromSeed,
};