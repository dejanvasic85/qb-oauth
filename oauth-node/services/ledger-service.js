const QuickBooks = require('node-quickbooks');
const config = require('app/config');
const Promise = require('bluebird');

module.exports = function (realmId, oauthToken, oauthTokenSecret) {

    const qbo = new QuickBooks(config.consumerKey,
        config.consumerSecret,
        oauthToken,
        oauthTokenSecret,
        realmId,
        false, // don't use the sandbox (i.e. for testing)
        false); // turn debugging on

    return {
        getCompanyFiles: () => {
            return new Promise((resolve, reject) => {
                qbo.findCompanyInfos({}, function (e, data) {
                    if(e){
                        reject(e);
                    }

                    if(data.QueryResponse && data.QueryResponse.CompanyInfo && data.QueryResponse.CompanyInfo.length > 0){

                        const companyInfo = data.QueryResponse.CompanyInfo[0];
                        resolve({
                            businessName: companyInfo.CompanyName
                        });

                    }
                    else{
                        reject('Data came back with invalid data. Response:', data);
                    }

                });
            });
        }
    }
};