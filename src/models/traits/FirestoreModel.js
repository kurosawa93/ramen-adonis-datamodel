'use strict'

const FirestoreOperationException = require('../../exceptions/FirestoreOperationException')

class RamenModel {
  register (Model, customOptions = {}) {
    const defaultOptions = {
      columns: [],
      collectionId: null
    }
    const options = Object.assign(defaultOptions, customOptions)

    Model.initiate = function(documentId = null) {
        const instance = new Model()
        return instance.setCollectionDb(options.collectionId, documentId)
    }

    Model.buildCreatedAt = function () {
        return new Date().toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, '')
    }

    Model.getData = async function(queryParams) {
        let instance = this.initiate()
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

    Model.getDataByDocumentId = async function (documentId) {
        const instance = this.initiate(documentId)
        return await instance.findOrFail()
    }

    Model.createData = async function (data) {
        if (options.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')
        
        const instance = this.initiate()
        const object = {}
        const columns = options.columns

        for (const column of columns) {
            object[column] = data[column]
        }
        object['created_at'] = instance.buildCreatedAt()
        await instance.add(object)
        return object
    }

    Model.updateData = async function (documentId, data) {
        if (options.columns.empty) 
            throw new FirestoreOperationException('columns is not defined in trait usage.')

        const instance = this.initiate(documentId)
        const object = {}
        const columns = options.columns

        for (const column of columns) {
            object[column] = data[column]
        }
        await instance.set(object)
        return object
    }

    Model.deleteData = async function (documentId) {
        await this.initiate(documentId).delete()
        return {id: documentId}
    }
  }
}

module.exports = RamenModel
