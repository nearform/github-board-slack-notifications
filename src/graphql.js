'use strict'

import { graphql } from '@octokit/graphql'
import { createAppAuth } from '@octokit/auth-app'
import config from './config.js'

const auth = createAppAuth({
  appId: config.ORG_APP_ID,
  privateKey: config.ORG_PRIVATE_KEY,
})

export const getProjectItemById = async ({ installationId, id }) => {
  const installationAuth = await auth({
    type: 'installation',
    installationId,
  })

  return await graphql({
    query: `query MyQuery($id: ID!) {
      node(id: $id) {
        ... on ProjectV2Item {
          id
          content {
            __typename
            ... on Issue {
              id
              title
            }
          }
        }
      }
    }`,
    id: id,
    headers: {
      authorization: `token ${installationAuth.token}`,
    },
  })
}
