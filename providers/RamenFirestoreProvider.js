const { ServiceProvider } = require('@adonisjs/fold')

class RamenFirestoreProvider extends ServiceProvider {
    boot() {}

    register() {
        this.app.singleton('Ramen/FirestoreModel', (app) => {
            const RamenFirestoreModel = require('../src/models/FirestoreBaseModel')
            return RamenFirestoreModel
        })
    }
}

module.exports = RamenFirestoreProvider