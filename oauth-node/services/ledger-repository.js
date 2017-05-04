var LedgerSchema = require('./ledger-schema');

module.exports = class LedgerRepository {

    constructor(mongoose) {

        if (!mongoose) {
            throw new Error("Mongo is not available at the moment.");
        }

        this.Ledger = mongoose.model('Ledger', LedgerSchema);
    }

    saveLedgerDetails(ledgerDetails) {

        var ledger = new this.Ledger(ledgerDetails);

        return ledger.save();
    };

    getLedgers() {
        return this.Ledger.find({});
    }
};