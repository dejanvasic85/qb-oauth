﻿var express = require('express');
var config = require('app/config');
var router = express.Router();
/* 
* Get the grant url to connect to the intuit server.
*/
router.get('/', function (req, res) {
   
    var grantUrl = 'http://localhost:' + config.Port + '/connect?goHome=true';
    res.render('index', { title: 'Welcome to intuit oauth node sample demo', grantUrl: grantUrl });
});


/*
* Display the access token and access secret.
*/
router.get('/close', function (req, res) {
    
    res.render('close', { Port:config.Port ,AccessToken: req.session.AccessToken, AccessTokenSecret: req.session.AccessTokenSecret });
});


module.exports = router;