'use stric'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class GenericResponseException extends LogicalException {
    handle(error, {response}) {
        return response.status(error.code).send({
            data: null,
            meta: {
                message: error.message
            }
        })
    }
}

module.exports = GenericResponseException