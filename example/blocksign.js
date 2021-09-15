const Xseal = require('../lib/seal');

const generator = new Xseal.Generator("mitum");
const parser = Xseal.JSONParser;

const source_priv = "SAZ4AMZV62FTWULIYLAH2PLR6LY7JVWAI4SOIFRHQLMNQ2W4NKMWDPL3:stellar-priv-v0.0.1";
const source_pub = "GCSFDZ63ZGFWHN3M4XNAZKPLKWEEW32BMTM3KSVK4IFY7JCUVNF6GPNH:stellar-pub-v0.0.1";
const source_addr = "6d1pvkKLurRPovsKuQ6X75r7gX5GYHzrWpzpgyyYe6xi:mca-v0.0.1";

const priv1 = "SDASY3GHXQUUJGPVMGB6PVPJYQZA5VGNY7PKG3O3OIVJ5AOTGR7CDWCS:stellar-priv-v0.0.1"
const pub1 = "GCWFGGOX4TTJ77OOAJH3IEPTBWS6F6D2V3DR76YZU4336DJHOWNJGWNV:stellar-pub-v0.0.1"
const addr1 = "3GFpucWfTjHFaseG4X6X83qEugtci7bzyxcE1xgRUqpQ:mca-v0.0.1"

// CreateDocumentsItem
const createDocumentsItem = generator.createCreateDocumentsItem("abcdabc:mbfh-v0.0.1", 150, "user01", "title150", 1234, "MCC", [addr1], ["user02"]);

// CreateDocumentsFact
const createDocumentsFact = generator.createBlockSignFact(generator.BLOCKSIGN_CREATE_DOCUMENTS, source_addr, [createDocumentsItem])

// CreateDocuments
const createDocuments = generator.createOperation(createDocumentsFact, "");
createDocuments.addSign(source_priv);

parser.generateFile(createDocuments.dict(), './example/create_documents.json');

// SignDocumentsItem
const signDocumentsItem = generator.createSignDocumentsItem(source_addr, 150, "MCC");

// SignDocumentsFact
const signDocumentsFact = generator.createBlockSignFact(generator.BLOCKSIGN_SIGN_DOCUMENTS, addr1, [signDocumentsItem]);

// SignDocuments
const SignDocuments = generator.createOperation(signDocumentsFact, "");
SignDocuments.addSign(source_priv);

parser.generateFile(SignDocuments.dict(), './example/sign_documents.json');

// // TransferDocumentsItem
// const transferDocumentsItem = generator.createTransferDocumentsItem(source_addr, addr1, 1, "MCC");

// // TransferDocumentsFact
// const transferDocumentsFact = generator.createBlockSignFact(generator.BLOCKSIGN_TRANSFER_DOCUMENTS, source_addr, [transferDocumentsItem]);

// // TransferDocuments
// const transferDocuments = generator.createOperation(transferDocumentsFact, "");
// transferDocuments.addSign(source_priv);

// parser.generateFile(transferDocuments.dict(), './example/transfer_documents.json');