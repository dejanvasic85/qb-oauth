var express = require('express');
var router = express.Router();
var config = require('app/config');
var
    request = require('request'),
    qs = require('querystring');

/* Get the request token. */
router.get('/', function (req, res) {
    var sessionData = req.session;
    sessionData.oauth_token_secret = '';

    if (req.query["goHome"]) {
        console.log('Not a popup... will end up on home page');
        sessionData.goHome = true;
    }

    var getrequestToken = {
        url: config.REQUEST_TOKEN_URL,
        oauth: {
            callback: 'http://localhost:' + config.Port + '/callback/',
            consumer_key: config.consumerKey,
            consumer_secret: config.consumerSecret
        }
    }
    request.post(getrequestToken, function (e, r, data) {
        var requestToken = qs.parse(data);
        sessionData.oauth_token_secret = requestToken.oauth_token_secret;
        sessionData.oauth_token = requestToken.oauth_token;
        console.log(requestToken);
        res.redirect(config.AuthorizeUrl + requestToken.oauth_token)
    })
});
module.exports = router;