'use strict'

const FirestoreOperationException = require('../exceptions/FirestoreOperationException')
const FirestoreResolver = require('../resolver/FirestoreResolver')
const Config = use('Config')

class FirestoreModel extends FirestoreResolver {
    constructor(columns) {
        super(Config)
        this.columns = columns
    }

    static buildCreatedAt() {
        return new Date().toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, '')
    }

    static async getData(queryParams) {
        let instance = FirestoreModel.initiate()
        let value = null
        for (const key in queryParams) {
            value = queryParams[key]
            if (value.includes(',')) {
                const valueArray = value.split(',')
                instance = instance.where(key, 'in', valueArray)
            }
            else {
                instance = instance.where(key, '=', value)
            }
        }

        const result = await instance.get()
        return result
    }

    static async getDataByDocumentId(documentId) {
        const instance = FirestoreModel.initiate(documentId)
        return await instance.findOrFail()
    }

    static async createData(data) {
        const instance = FirestoreModel.initiate()
        if (instance.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')

        const object = {}
        const columns = options.columns
        for (const column of columns) {
            object[column] = data[column]
        }

        object['created_at'] = instance.buildCreatedAt()
        await instance.add(object)

        return object
    }

    static async updateData(documentId, data) {
        const instance = FirestoreModel.initiate(documentId)
        if (instance.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')

        const object = {}
        const columns = options.columns
        for (const column of columns) {
            object[column] = data[column]
        }

        await instance.set(object)
        return object
    }

    static async deleteData(documentId) {
        await FirestoreModel.initiate(documentId).delete()
        return {id: documentId}
    }
}

module.exports = FirestoreModel
