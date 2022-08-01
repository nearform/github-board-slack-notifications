'use strict'

import { test } from 'tap'
import Fastify from 'fastify'
import Support from '../../plugins/support.js'

test('support works standalone', async t => {
  const fastify = Fastify()
  fastify.register(Support)

  await fastify.ready()
  t.equal(fastify.someSupport(), 'hugs')
})
