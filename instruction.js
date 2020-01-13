'use strict'

const path = require('path')

module.exports = async (cli) => {
    try {
        const configIn = path.join(__dirname, './config', 'ramenfirestore.js')
        const configOut = path.join(cli.helpers.configPath(), 'ramenfirestore.js')
        await cli.command.copy(configIn, configOut)
        cli.command.completed('create', 'config/ramenfirestore.js')
    } catch (error) {
        // ignore error
        console.log(error)
    }
}