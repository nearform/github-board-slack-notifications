'use strict'

const fp = require('fastify-plugin')

// See https://github.com/fastify/fastify-sensible

module.exports = fp(async function (fastify) {
  fastify.register(require('fastify-sensible'), {
    errorHandler: false,
  })
})
