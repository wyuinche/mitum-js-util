const Xseal = require('../lib/seal');

const generator = new Xseal.Generator("mitum");
const parser = Xseal.JSONParser;

const source_priv = "L5GTSKkRs9NPsXwYgACZdodNUJqCAWjz2BccuR4cAgxJumEZWjok:btc-priv-v0.0.1";
const source_pub = "rcrd3KA2wWNhKdAP8rHRzfRmgp91oR9mqopckyXRmCvG:btc-pub-v0.0.1";
const source_addr = "GbymDFuVmJwP4bjjyYu4L6xgBfUmdceufrMDdn4x1oz:mca-v0.0.1";

const priv1 = "SCXSRCZKAB5A53TKAFSFZEPMQRM4AAZAND2MBIHFDBEQLM3DWILRQUF2:stellar-priv-v0.0.1"
const pub1 = "GBMWRVVIY2SHIMLG3ZQR54WGXKG5RYXFHGC2HNT3W674DLXK6VQ4QY4X:stellar-pub-v0.0.1"
const addr1 = "ATDxH32CL7hdrpgLcvtNroNTF111V6wUJCK5JTa4f8Po:mca-v0.0.1"

// CreateDocumentsItem
const createDocumentsItem = generator.createCreateDocumentsItem("abcd:mbfh-v0.0.1", [], "MCC")

// CreateDocumentsFact
const createDocumentsFact = generator.createBlockSignFact(generator.BLOCKSIGN_CREATE_DOCUMENTS, source_addr, [createDocumentsItem])

// CreateDocuments
const createDocuments = generator.createOperation(createDocumentsFact, "");
createDocuments.addSign(source_priv);

parser.generateFile(createDocuments.dict(), './example/create_documents.json');

// SignDocumentsItem
const signDocumentsItem = generator.createSignDocumentsItem(source_addr, 1, "MCC");

// SignDocumentsFact
const signDocumentsFact = generator.createBlockSignFact(generator.BLOCKSIGN_SIGN_DOCUMENTS, source_addr, [signDocumentsItem]);

// SignDocuments
const SignDocuments = generator.createOperation(signDocumentsFact, "");
SignDocuments.addSign(source_priv);

parser.generateFile(SignDocuments.dict(), './example/sign_documents.json');

// TransferDocumentsItem
const transferDocumentsItem = generator.createTransferDocumentsItem(source_addr, addr1, 1, "MCC");

// TransferDocumentsFact
const transferDocumentsFact = generator.createBlockSignFact(generator.BLOCKSIGN_TRANSFER_DOCUMENTS, source_addr, [transferDocumentsItem]);

// TransferDocuments
const transferDocuments = generator.createOperation(transferDocumentsFact, "");
transferDocuments.addSign(source_priv);

parser.generateFile(transferDocuments.dict(), './example/transfer_documents.json');