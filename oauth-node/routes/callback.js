var express = require('express');
var router = express.Router();
    config = require('app/config'),
    request = require('request'),
    qs = require('querystring'),
    LedgerService = require('../services/ledger-service');

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

        // Store ledgers in the session
        if (!sessionData.ledgers) {
            sessionData.ledgers = [];
        }

        let ledgerDetails = {
            ledgerToken: accessTokenLocal.oauth_token,
            ledgerSecret: accessTokenLocal.oauth_token_secret
        };

        const ledgerService = new LedgerService(realmId,
            accessTokenLocal.oauth_token,
            accessTokenLocal.oauth_token_secret);

        ledgerService.getCompanyFiles().then((ledger) => {

            ledgerDetails.businessName = ledger.businessName;

            sessionData.ledgers.push(ledgerDetails);

            res.redirect('/');
        });
    })
});
module.exports = router;