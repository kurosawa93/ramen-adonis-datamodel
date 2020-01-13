'use strict'

const Firestore = require('@google-cloud/firestore')

class FirestoreBaseModel {
    constructor(Config) {
        const firestoreKey = Config._config.ramenfirestore.firestoreKey
        const projectId = Config._config.ramenfirestore.firestoreProjectId
        const firestoreDb = new Firestore({
            projectId: projectId,
            keyFilename: firestoreKey
        })

        this.firestoreDb = (() => {
            return firestoreDb
        })
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

    async find() {
        try {
            const result = await this.firestoreDb.get()
            if (!result.exists) {
                return {error: {code: 404, message: 'document does not exist'}}
            }
            return {data: result.data(), error: {}}
        }
        catch(err) {
            return {error: {code: 500, message: err.message}}
        }
    }

    async get() {
        try {
            const result = await this.firestoreDb.get()
            if (!result.exists) {
                return []
            }
            const data = []
            result.forEach(doc => {
                data.push(doc.data())
            })
            return {data: data, error: {}}
        }
        catch(err) {
            return {error: {code: 500, message: err.message}}
        }
    }

    async add(data) {
        try {
            const result = await this.firestoreDb.add(data)
            return {data: {id: result.id}, error: {}}
        }
        catch(err) {
            return {error: {code: 500, message: err.message}}
        }
    }
    
    async set(data) {
        try {
            const result = await this.firestoreDb.set(data)
            return {data: result.data(), error: {}}
        }
        catch(err) {
            return {error: {code: 500, message: err.message}}
        }
    }
}

module.exports = FirestoreBaseModel