'use strict'

const QueryResolver = require('../../utils/RamenQueryResolver')
const slugify = require('slugify')
const GenericResponseException = require('../../exceptions/GenericResponseException')

class RamenModel {
  register (Model, customOptions = {}) {
    const defaultOptions = {
      relations: [],
      columns: []
    }
    const options = Object.assign(defaultOptions, customOptions)
    
    Model.createObject = async function (data, trx = null) {
      let genericModel = new Model()
      return await Model.saveObject(data, genericModel)
    }

    Model.updateObject = async function (id, data) {
      let genericModel = await Model.find(id)
      if (!genericModel) {
        throw new GenericResponseException('DATA IS NOT EXIST FOR RELATED ID', null, 404)
      }
      return await Model.saveObject(data, genericModel)
    }

    Model.saveObject = async function (data, genericModel) {
      const columns = options.columns
      if (columns.length == 0) throw new GenericResponseException('MODEL ERROR. COLUMN IS NOT DEFINED IN RELATED MODEL', null, 500)

      columns.forEach(key => {
        genericModel[key] = data[key]
      })
  
      try {
          await genericModel.save()
          await Model.saveRelations(data, genericModel)
          await genericModel.reload()
          return {data: genericModel, error: {}}
      } catch (error){
        if (genericModel.id) {
          await genericModel.delete()
          throw new GenericResponseException('TRANSACTION ERROR OCCURED. ROLLBACK OPERATION ' + error.message, null, 500)
        }

        if (error.code == 23505) {
          throw new GenericResponseException('PAYLOAD ERROR. PRIMARY KEY ALREADY EXISTS', null, 422)
        }

        throw new GenericResponseException('POSTGRESQL ERROR. ' + error.message, null, 500)
      }
    }

    Model.saveRelations = async function (data, genericModel) {
      const relations = options.relations
      if (relations.length == 0) {
        return
      }

      for (let i = 0; i < relations.length; i++) {
        const relation = relations[i]
        const relationData = data[relation.name]
        if (!relationData) {
          continue
        }
        
        switch(relation.type) {
          case 'belongsToMany':
            await QueryResolver.saveBelongsToManyRelations(genericModel, relation.name, relationData)
            break
          case 'hasMany':
            await QueryResolver.saveHasManyRelations(genericModel, relation.name, relationData)
            break
          default:
            await QueryResolver.saveHasOneRelations(genericModel, relation.name, relationData)
        }
      }
    }

    Model.upsert = async function (data) {
      if (data.id != null) {
        const genericModel = await Model.updateObject(data.id, data)
        return {data: genericModel.data, error: {}}
      } else {
        const genericModel = await Model.createObject(data)
        return {data: genericModel.data, error: {}}
      }
    }

    Model.deleteData = async function (id) {
      const modelObj = await Model.find(id)
      if (!modelObj) {
        throw new GenericResponseException('DATA IS NOT EXIST FOR RELATED ID', null, 404)
      }

      try {
        await modelObj.delete()
        return {data: modelObj, error: {}}
      }
      catch(err) {
        throw new GenericResponseException('POSTGRESQL ERROR. ' + err.message, null, 500)
      }
    }

    Model.commonQueryBuilder = async function (builder, queryParams){
      let defaultMeta = {
        message: 'data successfully retrieved'
      }

      try {
        const queryResult = await QueryResolver.commonQueryBuilder(builder, queryParams)
        if (queryResult.pages) {
          Object.keys(queryResult.pages).forEach(pageElement => {
            defaultMeta[pageElement] = queryResult.pages[pageElement]
          })
        }
        return {data: queryResult.rows, meta: defaultMeta, error: {}}
      }
      catch(err) {
        throw new GenericResponseException('POSTGRESQL ERROR. ' + err.message, null, 500)
      }
    }

    Model.getBySlugWithLocale = async function (locale, slug) {
      const query = 'locale->\'' + locale + '\'->>\'slug\' = ?'
      const result = await Model.query().whereRaw(query, slug).first()
      return {data: result, error: {}}
    }

    /**
     * DEPRECATED
     */
    Model.assignSlug = function(obj, slugPath, slugValuePath) {
      const valuePath = slugValuePath.split('.')
      let value = data
      for (let i = 0; i < valuePath.length; i++) {
        value = value[valuePath[i]]
      }
      value = slugify(value)

      const slugPath = slugPath.split('.')
      const lastIndex = slugPath.length-1
      for (let i = 0; i < lastIndex; i++) {
        const key = slugPath[i]
        if (!(key in obj)) {
          return
        }
        obj = obj[key]
      }
      obj[slugPath[lastIndex]] = value
    }
  }
}

module.exports = RamenModel
