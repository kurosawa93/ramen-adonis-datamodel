const { ServiceProvider } = require('@adonisjs/fold')

class RamenModelProvider extends ServiceProvider {
    boot() {}

    register() {
        this.app.singleton('Ramen/ModelTrait', () => {
            const RamenModelTrait = require('../src/models/traits/RamenModel')
            return new RamenModelTrait()
        })
    }
}

module.exports = RamenModelProvider