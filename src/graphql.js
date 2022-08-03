'use strict'

import { graphql } from '@octokit/graphql'
import config from './config.js'

const graphqlWithAuth = graphql.defaults({
  //This is a github personal access token with read:project permission
  headers: {
    authorization: `token ${config.ORG_ACCESS_TOKEN}`,
  },
})

export const getProjectItemById = async id => {
  return await graphqlWithAuth({
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
  })
}
