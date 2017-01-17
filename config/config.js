var config = {}

config.host = process.env.HOST || "";
config.authKey = process.env.AUTH_KEY || "";
config.databaseId = "TestClientCredential";
config.productCollections = "productCollections";
config.userCollections = "userCollections";

config.secret = 'bhinnekaIsGreat';

// azure AD config
config.azuread = {
      clientID: 'your client ID',
     audience: 'your application URL',
  // example: https://login.microsoftonline.com/common/.well-known/openid-configuration
     identityMetadata: 'https://login.microsoftonline.com/<your tenant id>/.well-known/openid-configuration',
     validateIssuer: true, // if you have validation on, you cannot have users from multiple tenants sign in to your server
     passReqToCallback: false,
     loggingLevel: 'info' // valid are 'info', 'warn', 'error'.

};

module.exports = config;
