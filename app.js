'use strict'

import path from 'path'
import AutoLoad from '@fastify/autoload'
import Env from '@fastify/env'
import Cors from '@fastify/cors'
import S from 'fluent-json-schema'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

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

export default App
