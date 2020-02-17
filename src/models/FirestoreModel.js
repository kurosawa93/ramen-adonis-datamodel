'use strict'

const FirestoreOperationException = require('../exceptions/FirestoreOperationException')
const FirestoreResolver = require('../resolver/FirestoreResolver')
const Config = use('Config')

class FirestoreModel extends FirestoreResolver {
    constructor(columns, collection) {
        super(Config)
        this.columns = columns
        this.collection = collection
    }

    static initiate(documentId = null) {
        const instance = new this()
        return instance.setCollectionDb(instance.collection, documentId)
    }

    static buildCreatedAt() {
        return new Date().toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, '')
    }

    static getInstance(documentId = null, customInstance = null) {
        if (customInstance)
            return customInstance
        
        return this.initiate(documentId)
    }

    static async getData(queryParams, customInstance = null) {
        let instance = this.getInstance(null, customInstance)
        if (queryParams) {
            let value = null
            for (let key in queryParams) {
                if (key === 'limit') {
                    instance = instance.limit(queryParams[key])
                    continue
                }

                value = queryParams[key]
                if (key.includes('*')) {
                    key = key.replace('*', '')

                    if (value.includes(',')) {
                        const valueArray = value.split(',')
                        instance = instance.where(key, 'array-contains-any', valueArray)
                    }
                    else {
                        instance = instance.where(key, 'array-contains', value)
                    }
                }
                else if (value.includes(',')) {
                    instance = instance.where(key, 'in', valueArray)
                }
                else {
                    instance = instance.where(key, '=', value)
                }
            }
        }

        const result = await instance.get()
        return result
    }

    static async getDataByDocumentId(documentId, customInstance = null) {
        const instance = this.getInstance(documentId, customInstance)
        return await instance.findOrFail()
    }

    static async createData(data, customInstance = null) {
        const instance = this.getInstance(null, customInstance)
        if (instance.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')

        const object = {}
        const columns = instance.columns
        for (const column of columns) {
            if (data[column]) {
                object[column] = data[column]
                continue
            }
            object[column] = null
        }

        object['created_at'] = this.buildCreatedAt()
        await instance.add(object)

        return object
    }

    static async createDataByDocumentId(documentId, data, customInstance) {
        let instance = this.getInstance(documentId, customInstance)
        if (instance.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')

        const object = {}
        const columns = instance.columns
        for (const column of columns) {
            if (data[column]) {
                object[column] = data[column]
                continue
            }
            object[column] = null
        }

        await instance.set(object)
        return object
    }

    static async updateData(documentId, data, customInstance = null) {
        let instance = this.getInstance(documentId, customInstance)
        if (instance.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')

        const currentData = await this.getDataByDocumentId(documentId, instance)
        const columns = instance.columns
        for (const column of columns) {
            if (data[column])
                object[column] = data[column]
        }

        await instance.set(currentData)
        return object
    }

    static async deleteData(documentId) {
        await this.initiate(documentId).delete()
        return {id: documentId}
    }
}

module.exports = FirestoreModel
