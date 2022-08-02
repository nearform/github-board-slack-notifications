'use strict'

import fp from 'fastify-plugin'
import fastifySensible from '@fastify/sensible'

// See https://github.com/fastify/fastify-sensible

export default fp(async function (fastify) {
  fastify.register(fastifySensible, {
    errorHandler: false,
  })
})
