const xkey = require('../lib/key'); // const mitumc = require('mitumc');

const btckp = xkey.getKeypair('btc'); // mitumc.getKeypair()
const etherkp = xkey.getKeypair('ether');
const stellarkp = xkey.getKeypair('stellar');

console.log(btckp.getPrivateKey());
console.log(btckp.getPublicKey());
console.log(etherkp.getPrivateKey());
console.log(etherkp.getPublicKey());
console.log(stellarkp.getPrivateKey());
console.log(stellarkp.getPublicKey());