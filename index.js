module.exports = {
    Keypair: require('./lib/key').Keypair,
    getNewKeypair: require('./lib/key').getNewKeypair,
    Generator: require('./lib/seal').Generator,
    JSONParser: require('./lib/seal').JSONParser,
    Signer: require('./lib/seal').Signer,
};