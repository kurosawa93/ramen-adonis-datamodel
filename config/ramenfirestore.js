'use strict'

const Env = use('Env')

module.exports = {
    firestoreKey: Env.get('GOOGLE_FIRESTORE_KEY', 'credentials.json'),
    firestoreProjectId: Env.get('GOOGLE_FIRESTORE_PROJECT_ID', 'liga-ultimate-stg')
}