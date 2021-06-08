const Xoper = require('./operation');
const Xsign = require('./sign');
const Xutil = require('./util');
const Xhint = require('./hint');
const Xkey = require('./key');

const bs58 = require('bs58');
const base58 = require('bs58');

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

const Generator = (_netID) => {
    this.netID = _netID;
    this.setNetworkID = (_id) => {
        this.netID = _id;
    };

    this.createKeys = (keys, threshold) => {
        return _toKeys(keys, threshold);
    };

    this.createAmounts = (amts) => {
        return _toAmounts(amts);
    };
    
    this.createCreateAccountsItem = (keys, amts) => {
        const _type = amts.length <= 1 ? Xhint.MC_CREATE_ACCOUNTS_SINGLE_AMOUNT : Xhint.MC_CREATE_ACCOUNTS_MULTIPLE_AMOUNTS;
        return new Xoper.CreateAccountsItem(
            _type, keys, amts
        );
    };

    this.createTransfersItem = (receiver, amts) => {
        const _type = amts.length <= 1 ? Xhint.MC_TRNASFERS_ITEM_SINGLE_AMOUNT : Xhint.MC_TRANSFERS_ITEM_MULTI_AMOUNTS;
        return new Xoper.TransfersItem(
            _type, receiver, amts
        )
    };

    this.createCreateAccountsFact = (sender, items) => {
        return new Xoper.CreateAccountsFact(
            sender, items
        );
    };

    this.createKeyUpdaterFact = (target, cid, keys) => {
        return new Xoper.KeyUpdaterFact(
            target, cid, keys
        );
    };

    this.createTransfersFact = (sender, items) => {
        return new Xoper.TransfersFact(
            sender, items
        )
    };

    this.createOperation = (fact, memo) => {
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

    this.createSeal = (sk, opers) => {
        const keypair = Xsign.getKeypair(sk);
        const signedAt = Xutil.getTimeStamp();
        const bsignedAt = Buffer.from(Xutil.dateToUTC(signedAt));
        const bsigner = Buffer.from(keypair.getPublicKey());

        let bopers = Buffer.from();
        for(var i = 0; i < opers.length; i++) {
            bopers = Buffer.concat([bopers, opers[i].hash.digest()]);
        }

        const bodyHash = Xutil.sum256(
            Buffer.concat([bsigner, bsignedAt, bopers]));

        const signature = keypair.sign(
            Buffer.concat(
                [bodyHash.digest(), Buffer.from(this.netID)]
            )
        );
        
        const hash = Xutil.sum256(
            Buffer.concat([bodyHash.digest(), signature])
        );

        const seal = {};
        seal._hint = Xutil._hint(Xhint.SEAL);
        seal.hash = bs58.encode(hash.digest());
        seal.body_hash = bs58.encode(bodyHash.digest());
        seal.signer = keypair.getPublicKey();
        seal.signature = bs58.encode(signature);
        seal.signed_at = signedAt.toISOString();

        const operations = [];
        for(var i = 0; i < opers.length; i++){
            operations.push(opers.dict());
        }
        seal.operations = operations;

        return seal;
    };
};

const JSONParser = {
    toJSONString: (seal) => {
        return JSON.stringify(seal);
    },
    generateFile: (seal, fName) => {
        const fs = require('fs');
        fs.writeFile(fName, JSON.stringify(seal), (error) => {
            if(error) throw error;
        });
        console.log("generateFile() arg: " + fName + ", Success...");
    }
};