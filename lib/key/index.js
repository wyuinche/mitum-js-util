const { Address, Key, Keys } = require('./key');
const { Keypair, getNewKeypair, getKeypairFromPrivateKey, getKeypairFromSeed } = require('./keypair');


module.exports = {
    Address,
    Key,
    Keys,
    Keypair,
    getNewKeypair,
    getKeypairFromPrivateKey,
    getKeypairFromSeed
};