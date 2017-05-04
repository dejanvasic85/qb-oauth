var LedgerSchema = require('./ledger-schema');
var Promise = require('bluebird');

module.exports = class LedgerRepository {

    constructor(mongoose) {

        if (!mongoose) {
            throw new Error("Mongo is not available at the moment.");
        }

        this.Ledger = mongoose.model('Ledger', LedgerSchema);
    }

    saveLedgerDetails(ledgerDetails) {

        return new Promise((resolve, reject) => {

            this.Ledger.findOne({id: ledgerDetails.id}, (err, data) => {

                if (err) {
                    reject(err);
                }

                if (data) {
                    console.log('Found ledger. Overriding the details.');
                    Object.assign(data, ledgerDetails);
                }
                else {

                    data = new this.Ledger(ledgerDetails)
                }

                return data.save().then(() => {
                    resolve(data);
                });
            });

        });
    };

    getLedgers() {
        return this.Ledger.find({});
    }
};