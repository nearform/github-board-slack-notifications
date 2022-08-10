'use strict'

import Fastify from 'fastify'
import path from 'path'
import AutoLoad from '@fastify/autoload'
import Env from '@fastify/env'
import Cors from '@fastify/cors'
import S from 'fluent-json-schema'
import * as url from 'url'
import config from './config.js'

const __dirname = url.fileURLToPath(new URL('..', import.meta.url))

function buildServer(envConfig = config) {
  const opts = {
    ...envConfig,
    logger: {
      level: envConfig.LOG_LEVEL,
      ...(envConfig.PRETTY_PRINT && {
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
  return fastify
}

export default buildServer
