const QuickBooks = require('node-quickbooks');
const config = require('app/config');
const Promise = require('bluebird');

module.exports = function (realmId, oauthToken, oauthTokenSecret) {

    var me = this;
    me.id = realmId;

    const qbo = new QuickBooks(config.consumerKey,
        config.consumerSecret,
        oauthToken,
        oauthTokenSecret,
        realmId,
        false, // don't use the sandbox (i.e. for testing)
        false); // turn debugging on

    return {
        getCompanyInfo: () => {
            return new Promise((resolve, reject) => {
                qbo.findCompanyInfos({}, function (e, data) {
                    if(e){
                        reject(e);
                    }

                    if(data.QueryResponse && data.QueryResponse.CompanyInfo && data.QueryResponse.CompanyInfo.length > 0){

                        const companyInfo = data.QueryResponse.CompanyInfo[0];

                        console.log('companyInfo Returned', companyInfo);

                        resolve({
                            id: me.id,
                            businessName: companyInfo.CompanyName,
                            countryCode: companyInfo.Country,
                            email: companyInfo.Email.Address
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