'use strict'

export const getProjectItemById = async ({ graphqlClient, id }) => {
  return await graphqlClient({
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
            number
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
  })
}
