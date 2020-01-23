const { ServiceProvider } = require('@adonisjs/fold')

class RamenFirestoreProvider extends ServiceProvider {
    boot() {}

    register() {
        this.app.singleton('Ramen/FirestoreResolver', (app) => {
            const RamenFirestoreResolver = require('../src/resolver/FirestoreResolver')
            return RamenFirestoreResolver
        })

        this.app.singleton('Ramen/FirestoreModel', (app) => {
            const RamenFirestoreTrait = require('../src/models/FirestoreModel')
            return RamenFirestoreTrait
        })
    }
}

module.exports = RamenFirestoreProvider