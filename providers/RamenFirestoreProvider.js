const { ServiceProvider } = require('@adonisjs/fold')

class RamenFirestoreProvider extends ServiceProvider {
    boot() {}

    register() {
        this.app.singleton('Ramen/FirestoreModel', (app) => {
            const RamenFirestoreModel = require('../src/resolver/FirestoreResolver')
            return RamenFirestoreModel
        })

        this.app.singleton('Ramen/FirestoreTrait', (app) => {
            const RamenFirestoreTrait = require('../src/models/traits/FirestoreModel')
            return new RamenFirestoreTrait()
        })
    }
}

module.exports = RamenFirestoreProvider