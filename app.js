'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const Env = require('fastify-env')
const Cors = require('fastify-cors')
const S = require('fluent-json-schema')

async function App(fastify, opts) {
  fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().default('development'))
      .valueOf(),
  })

  // Enables the use of CORS in a Fastify application.
  fastify.register(Cors, {
    origin: false,
  })

  // Loads all plugins defined in plugins folder
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts),
  })

  // Loads all plugins defined in routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  })
}

module.exports = App
