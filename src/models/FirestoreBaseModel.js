'use strict'

const Firestore = require('@google-cloud/firestore')
const FirestoreOperationException = require('../exceptions/FirestoreOperationException')
const GenericResponseException = require('../exceptions/GenericResponseException')

class FirestoreBaseModel {
    constructor(Config) {
        const firestoreKey = Config._config.ramenfirestore.firestoreKey
        const projectId = Config._config.ramenfirestore.firestoreProjectId
        const firestoreDb = new Firestore({
            projectId: projectId,
            keyFilename: firestoreKey
        })

        this.firestoreDb = firestoreDb
    }

    setCollectionDb(collectionName, documentId = null) {
        this.firestoreDb = this.firestoreDb.collection(collectionName)
        if (documentId) {
            this.firestoreDb = this.firestoreDb.doc(documentId)
        }
        return this
    }

    where(columnName, operator, value) {
        this.firestoreDb = this.firestoreDb.where(columnName, operator, value)
        return this
    }

    async findOrFail() {
        try {
            const result = await this.firestoreDb.get()
            if (!result.exists) {
                throw new GenericResponseException('Data not found for this id.', null, 404)
            }
            return result.data()
        }
        catch(err) {
            throw new FirestoreOperationException('Exception in Firestore Operation. ' + err.message)
        }
    }

    async find() {
        try {
            const result = await this.firestoreDb.get()
            if (!result.exists) {
                return null
            }
            return result.data()
        }
        catch(err) {
            throw new FirestoreOperationException('Exception in Firestore Operation. ' + err.message)
        }
    }

    async get() {
        try {
            const data = []
            const result = await this.firestoreDb.get()
            if (result.empty) {
                return data
            }

            result.forEach(doc => {
                data.push(doc.data())
            })
            return data
        }
        catch(err) {
            throw new FirestoreOperationException('Exception in Firestore Operation. ' + err.message)
        }
    }

    async add(data) {
        try {
            const result = await this.firestoreDb.add(data)
            data.id = result.id
            return data
        }
        catch(err) {
            throw new FirestoreOperationException('Exception in Firestore Operation. ' + err.message)
        }
    }
    
    async set(data) {
        try {
            await this.firestoreDb.set(data)
            return data
        }
        catch(err) {
            throw new FirestoreOperationException('Exception in Firestore Operation. ' + err.message)
        }
    }

    async delete() {
        try {
            await this.firestoreDb.delete()
            return
        }
        catch(err) {
            throw new FirestoreOperationException('Exception in Firestore Operation. ' + err.message)
        }
    }
}

module.exports = FirestoreBaseModel