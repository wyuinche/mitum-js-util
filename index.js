module.exports = {
    Generator: require('./lib/seal').Generator,
    JSONParser: require('./lib/seal').JSONParser,
    getKeypair: require('./lib/key').getKeypair,
    toKeypair: require('./lib/key').toKeypair
};