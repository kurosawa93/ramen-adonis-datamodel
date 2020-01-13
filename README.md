# ramen-adonis-datamodel

`ramen-adonis-datamodel` is part of `ramen` package for `Adonis.JS` framework. Currently, it offers wrapper for Google Firestore operations, including query, adding, and updating data.
There will be plans to support another data model in the future, if it is needed.

## Installation
You can install the package using command

    adonis install ramen-adonis-datamodel

The installer will copy the following files into your project directory.

  - `config/ramenfirestore.js`

These files should be located inside your project directory after a successfull installation.

## How to Use
Detailed instructions for how to integrate the package to your project can be found in [instruction.md](https://github.com/kurosawa93/ramen-adonis/blob/master/instructions.md)
file which will be automatically opened after a successfull installation.

## Features

By extending your model with `Ramen/FirestoreModel` class, you can access following methods from your model in order to access firestore operations

### setCollectionDb(collectionName, documentId = null)

this method will set the firestore instance to point to correspoding `collectionName` collection. documentId is an optional parameter, but will be mandatory if you want to access
specific document id, and also when you want to chain this method multiple times. This method is mandatory when you want to access the other method in this package.

### where(columnName, operator, value)

THis method will be adding where clause to the firestore instance, in order you want to query some data from firestore server. `columnName` is the column name which exist in your document property. `operator` is a comparison operator which is supported by firestore. `value` is the comparable data. Please note in order to use this function, you will need to chain it with `setCollectionDb` method

### async find()

This method will be returning the specific document data from a specific collection. 

### async get()

This method will execute the query which is already you specified using `where()` method. This also can be used to get all collection data, by chaining it with `setCollectionDb(collectionName)`.



### Request Parsing
  
