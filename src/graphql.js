'use strict'

export const getProjectItemById = async ({ graphqlClient, id }) => {
  return graphqlClient({
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
            ... on PullRequest {
              id
              title
              body
              url
              author {
                url
                login
                ... on User {
                  name
                }
              }
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

export const getActivityById = async ({ graphqlClient, id }) => {
  return graphqlClient({
    query: `query getProjectItem($id: ID!) {
      node(id: $id) {        
        ... on DraftIssue {
          title
        }
        ... on Issue {
          number
          title
          url,
          author {
            url
            login
            ... on User {
              name
            }
          }
        }
      ... on PullRequest {
          number
          title
          url
        }
      }
    }`,
    id,
  })
}

export const getProjectById = async ({ graphqlClient, id }) => {
  return graphqlClient({
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

export const getChangedItem = async ({ graphqlClient, id }) => {
  return graphqlClient({
    query: `query getChangesDetail($id: ID!){
    node(id: $id) {
      ... on ProjectV2SingleSelectField {
        id
        name
      }
    }
  }`,
    id,
  })
}

export async function getItem(request) {
  const {
    projects_v2_item: { node_id, content_node_id, project_node_id },
  } = request.body

  return getProjectItem({ request, node_id }).catch(async () => {
    const { node: project } = await getProjectById({
      graphqlClient: await request.authenticateGraphql(),
      id: project_node_id,
    })
    const { node: content } = await getActivityById({
      graphqlClient: await request.authenticateGraphql(),
      id: content_node_id,
    })
    return {
      node: {
        project,
        content: content
          ? content
          : {
              author: {},
            },
        creator: {},
        fieldValueByName: {},
      },
    }
  })
}

async function getProjectItem({ request, node_id }) {
  return getProjectItemById({
    graphqlClient: await request.authenticateGraphql(),
    id: node_id,
  })
}
