'use strict'

import { graphql } from '@octokit/graphql'
import { createAppAuth } from '@octokit/auth-app'
import config from '../src/config.js'
import fp from 'fastify-plugin'

const auth = createAppAuth({
  appId: config.ORG_APP_ID,
  privateKey: config.ORG_PRIVATE_KEY,
})

export const createGraphqlClient = async installationId => {
  const { token } = await auth({
    type: 'installation',
    installationId,
  })

  return graphql.defaults({
    headers: {
      authorization: `token: ${token}`,
    },
  })
}

export default fp(async function (fastify, options) {
  const { graphqlClient = createGraphqlClient } = options

  fastify.decorateRequest('authenticateGraphql', function () {
    return graphqlClient(this.body.installation.id)
  })
})
