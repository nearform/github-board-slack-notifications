'use strict'

import 'pino-pretty'
import Fastify from 'fastify'
import Env from '@fastify/env'
import Cors from '@fastify/cors'
import S from 'fluent-json-schema'
import config from './config.js'
import sensible from '../plugins/sensible.js'
import initSlackApp from '../plugins/init-slack-app.js'
import authenticateGraphql from '../plugins/authenticate-graphql.js'
import webhook from '../routes/webhook.js'

function buildServer(envConfig) {
  const opts = {
    ...config,
    ...envConfig,
    logger: {
      level: (envConfig || config).LOG_LEVEL,
      ...((envConfig || config).PRETTY_PRINT && {
        transport: {
          target: 'pino-pretty',
        },
      }),
    },
  }

  const fastify = Fastify(opts)

  fastify.register(Env, {
    schema: S.object()
      .prop('NODE_ENV', S.string().default('development'))
      .valueOf(),
  })

  // Enables the use of CORS in a Fastify application.
  fastify.register(Cors, {
    origin: false,
  })

  // Loads plugins
  fastify.register(sensible, opts)
  fastify.register(initSlackApp, opts)
  fastify.register(authenticateGraphql, opts)

  // Loads routes
  fastify.register(webhook, opts)

  return fastify
}

export default buildServer
