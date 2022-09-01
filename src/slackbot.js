import { getRawMessage, formatMessage } from './messages.js'
import { notificationConfig } from './config.js'
import {
  getProjectById,
  getActivityById,
  getProjectItemById,
} from './graphql.js'

async function sendMessage({ app, text, channels }) {
  return Promise.all(
    channels.map(channel => {
      return app.client.chat.postMessage({
        channel,
        text,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text,
            },
          },
        ],
      })
    })
  )
}

export async function sendNotification({ request, app }) {
  const { action, changes } = request.body

  const actionConfig = getActionConfig({ action })
  if (!actionConfig) return

  const { node } = await getItem(request)

  const message = formatMessage({
    content_type: getContentType(request),
    node,
    message: await getRawMessage({ actionConfig, changes, request }),
  })

  return sendMessage({ app, text: message, channels: getChannels({ node }) })
}

function getActionConfig({ action }) {
  const {
    actions: { [action]: actionConfig },
  } = notificationConfig
  return actionConfig
}

function getChannels({ node }) {
  const {
    project: {
      field: { options },
    },
  } = node
  return options.map(({ name }) => name)
}

export function getContentType(request) {
  const {
    body: {
      projects_v2_item: { content_type },
    },
  } = request
  return content_type
}

/* istanbul ignore next */
export async function getItem(request) {
  const {
    projects_v2_item: { node_id, content_node_id, project_node_id },
  } = request.body

  return getProjectItemById({
    graphqlClient: await request.authenticateGraphql(),
    id: node_id,
  }).catch(async () => {
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
