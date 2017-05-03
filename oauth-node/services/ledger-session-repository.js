module.exports = class LedgerSessionRepository {

    constructor(session) {

        if (!session) {
            throw new Error("Session is not available at the moment.");
        }

        if (!session.ledgers) {
            session.ledgers = {};
        }

        this.session = session;
    }

    saveLedgerDetails(ledgerDetails) {
        this.session.ledgers[ledgerDetails.id] = ledgerDetails;
    };

    getLedgers() {
        let ledgersWithoutKey = [];
        Object.keys(this.session.ledgers).forEach(id => {
            ledgersWithoutKey.push(this.session.ledgers[id]);
        });
        return ledgersWithoutKey;
    }
};