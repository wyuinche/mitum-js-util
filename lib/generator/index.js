const { JSONParser } = require('./parser');
const { Generator } = require('./generator');

const { DELEGATE_MODE, SIGN_QUALIFICATION } = require('../operation/nft');
const modes = {
    DELEGATE_MODE,
    SIGN_QUALIFICATION,
};


module.exports = {
    Generator,
    JSONParser,
    modes,
};