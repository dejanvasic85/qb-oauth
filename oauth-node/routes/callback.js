var express = require('express');
var router = express.Router();
var config = require('app/config');
var request = require('request');
var qs = require('querystring');
var mongoose = require('mongoose');
var LedgerService = require('../services/ledger-service');
var Repository = require('../services/ledger-repository');

/* GET the access token. */
router.get('/', function (req, res) {
    var sessionData = req.session;
    sessionData.AccessToken = '';
    sessionData.AccessTokenSecret = '';
    sessionData.Port = config.Port;
    var realmId = req.query.realmId;

    var getAccessToken = {
        url: config.ACCESS_TOKEN_URL,
        oauth: {
            consumer_key: config.consumerKey,
            consumer_secret: config.consumerSecret,
            token: req.query.oauth_token,
            token_secret: req.session.oauth_token_secret,
            verifier: req.query.oauth_verifier,
            realmId: req.query.realmId
        }
    };

    request.post(getAccessToken, function (e, r, data) {

        var accessTokenLocal = qs.parse(data);
        var repository = new Repository(mongoose);


        let ledgerDetails = {
            ledgerToken: accessTokenLocal.oauth_token,
            ledgerSecret: accessTokenLocal.oauth_token_secret
        };

        const ledgerService = new LedgerService(realmId,
            accessTokenLocal.oauth_token,
            accessTokenLocal.oauth_token_secret);

        ledgerService.getCompanyInfo().then((ledger) => {

            ledgerDetails.id = ledger.id;
            ledgerDetails.businessName = ledger.businessName;
            ledgerDetails.countryCode = ledger.countryCode;
            ledgerDetails.email = ledger.email;

            repository.saveLedgerDetails(ledgerDetails)
                .then(() => {
                    res.redirect('/');
                })
                .catch(err => {
                    console.error(err);
                    throw err;
                });
        });
    })
});
module.exports = router;