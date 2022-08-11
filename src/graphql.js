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
            url
            field(name: "SlackChannel") {
              ... on ProjectV2SingleSelectField {
                name
                options {
                  name
                }
              }
            }
          }
          content {
            ... on Issue {
              assignees(last: 3) {
                nodes {
                  url
                  login
                  ... on User {
                    name
                  }
                }
              }
              author {
                url
                login
                ... on User {
                  name
                }
              }
              id
              title
              body
              url
              number
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
    id,
  })
}

export const getIssueById = async ({ graphqlClient, id }) => {
  return await graphqlClient({
    query: `query getProjectItem($id: ID!) {
      node(id: $id) {        
        ... on DraftIssue {
          title
        }
        ... on Issue {
          number
          title
        }
      }
    }`,
    id,
  })
}

export const getProjectById = async ({ graphqlClient, id }) => {
  return await graphqlClient({
    query: `query getProjectItem($id: ID!) {
      node(id: $id) {        
        ... on ProjectV2 {
          title
          number
          url
          field(name: "SlackChannel") {
            ... on ProjectV2SingleSelectField {
              name
              options {
                name
              }
            }
          }
        }
      }
    }`,
    id,
  })
}
