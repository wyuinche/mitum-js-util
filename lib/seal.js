const Xoper = require('./operation');
const Xsign = require('./sign');
const Xutil = require('./util');
const Xhint = require('./hint');
const Xkey = require('./key');

const bs58 = require('bs58');

const _toKeys = (ks, threshold) => {
    const _keys = [];

    for(var i = 0; i < ks.length; i++){
        _keys.push(
            new Xkey.Key(
                ks[i].key,
                ks[i].weight
            )
        )
    }

    const keys = new Xkey.Keys(
        _keys,
        threshold,
    );

    return keys;
};

const _toAmounts = (amts) => {
    const _amounts = [];

    for(var i = 0; i < amts.length; i++) {
        _amounts.push(
            new Xoper.Amount(
                amts[i].big,
                amts[i].cid
            )
        );
    }

    return _amounts;
};

class Generator {
    constructor(netID) {
        this.netID = netID;
    }

    get id() {
        return this.netID;
    }

    setNetworkID(_id) {
        this.netID = _id;
    }

    formatKey(key, weight){
        if(key.indexOf(':') === -1){
            throw '[ERROR] Invalid key';
        }
        if(typeof(weight) !== 'number'){
            throw '[ERROR] Invalid weight'
        }
        return {
            key: key,
            weight: weight
        };
    }

    formatAmount(big, cid){
        if(typeof(big) !== 'number'){
            throw '[ERROR] Invalid amount';
        }
        if(cid.length < 1){
            throw '[ERROR] Invalid currency id';
        }
        return {
            big: big,
            cid: cid
        }
    }

    createKeys(keys, threshold){
        return _toKeys(keys, threshold);
    };

    createAmounts(amts){
        return _toAmounts(amts);
    };
    
    createCreateAccountsItem(keys, amts){
        const _type = amts.length <= 1 ? Xhint.MC_CREATE_ACCOUNTS_SINGLE_AMOUNT : Xhint.MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS;
        return new Xoper.CreateAccountsItem(
            _type, keys, amts
        );
    };

    createTransfersItem(receiver, amts){
        const _type = amts.length <= 1 ? Xhint.MC_TRNASFERS_ITEM_SINGLE_AMOUNT : Xhint.MC_TRANSFERS_ITEM_MULTI_AMOUNTS;
        return new Xoper.TransfersItem(
            _type, receiver, amts
        )
    };

    createCreateAccountsFact(sender, items){
        return new Xoper.CreateAccountsFact(
            sender, items
        );
    };

    createKeyUpdaterFact(target, cid, keys){
        return new Xoper.KeyUpdaterFact(
            target, cid, keys
        );
    };

    createTransfersFact(sender, items){
        return new Xoper.TransfersFact(
            sender, items
        )
    };

    createOperation(fact, memo){
        let _type;

        if(fact instanceof Xoper.CreateAccountsFact) {
            _type = Xhint.MC_CREATE_ACCOUNTS_OP;
        }
        else if(fact instanceof Xoper.KeyUpdaterFact) {
            _type = Xhint.MC_KEYUPDATER_OP;
        }
        else if(fact instanceof Xoper.TransfersFact) {
            _type = Xhint.MC_TRANSFERS_OP;
        }
        else {
            throw '[ERROR] Invalid fact object';
        }

        return new Xoper.Operation(
            this.netID, _type, memo, fact
        );
    };

    createSeal(sk, opers){
        const keypair = Xsign.getKeypair(sk);
        const signedAt = Xutil.getTimeStamp();
        const bsignedAt = Buffer.from(Xutil.dateToUTC(signedAt));
        const bsigner = Buffer.from(keypair.getPublicKey());

        let bopers = Buffer.from('');
        for(var i = 0; i < opers.length; i++) {
            bopers = Buffer.concat([bopers, opers[i].hash]);
        }

        const bodyHash = Xutil.sum256(
            Buffer.concat([bsigner, bsignedAt, bopers]));

        const signature = keypair.sign(
            Buffer.concat(
                [bodyHash, Buffer.from(this.netID)]
            )
        );
        
        const hash = Xutil.sum256(
            Buffer.concat([bodyHash, signature])
        );

        const seal = {};
        seal._hint = Xutil._hint(Xhint.SEAL);
        seal.hash = bs58.encode(hash);
        seal.body_hash = bs58.encode(bodyHash);
        seal.signer = keypair.getPublicKey();
        seal.signature = bs58.encode(signature);
        seal.signed_at = signedAt.toISOString();

        const operations = [];
        for(var i = 0; i < opers.length; i++){
            operations.push(opers[i].dict());
        }
        seal.operations = operations;

        return seal;
    };
};

const JSONParser = {
    toJSONString: (seal) => {
        return JSON.stringify(seal, null, 4);
    },
    generateFile: (seal, fName) => {
        const fs = require('fs');
        fs.writeFile(fName, JSON.stringify(seal, null, 4), (error) => {
            if(error) throw error;
        });
        console.log("generateFile() arg: " + fName + ", Success...");
    }
};

module.exports = {
    Generator,
    JSONParser
};