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
    query: `query getProjectItem($id: ID!) {
      node(id: $id) {
        ... on ProjectV2Item {
          creator {
            url
            login
          }
          id
          project {
            title
          }
          content {
            ... on Issue {
              assignees(last: 3) {
                nodes {
                  url
                  login
                }
              }
              author {
                url
                login
              }
              id
              title
              body
              url
              repository {
                url
                name
              }
            }
            ... on DraftIssue {
              id
              title
              body
            }
          }
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              id
              name
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
