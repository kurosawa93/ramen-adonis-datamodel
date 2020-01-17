'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class FirestoreOperationException extends LogicalException {
    handle(error, {response}) {
        return response.status(500).send({
            data: null,
            meta: {
                message: error.message
            }
        })
    }
}

module.exports = FirestoreOperationException