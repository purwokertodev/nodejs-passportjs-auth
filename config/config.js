var config = {}

config.host = process.env.HOST || "https://test-client-credential.documents.azure.com:443/";
config.authKey = process.env.AUTH_KEY || "0nLil8zRVEPZn4oMv9exJbtG0JOApJoTFhHf2pcBnMAFKdQ1pvpDmvuvLvc2SgmQayxTIjdI8RAwsBUmYfIZ3g==";
config.databaseId = "TestClientCredential";
config.productCollections = "productCollections";
config.userCollections = "userCollections";

config.secret = 'bhinnekaIsGreat';

module.exports = config;
