'use strict'

import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/core'
import { retry } from '@octokit/plugin-retry'
import config from '../src/config.js'
import fp from 'fastify-plugin'

export const createGraphqlClient = async installationId => {
  const PluginOctokit = Octokit.plugin(retry)
  const octokit = new PluginOctokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.APP_ID,
      privateKey: new Buffer.from(config.APP_PRIVATE_KEY, 'base64').toString(),
      installationId,
    },
  })
  return octokit.graphql
}

export default fp(async function (fastify, options) {
  const { graphqlClient = createGraphqlClient } = options

  fastify.decorateRequest('authenticateGraphql', function () {
    return graphqlClient(this.body.installation.id)
  })
})
