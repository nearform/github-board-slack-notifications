import {
  issueUpdatedMessage,
  draftIssueCreatedMessage,
  issueCreatedMessage,
  issueDeletedMessage,
  pullRequestCreatedMessage,
  pullRequestDeletedMessage,
} from './messages.js'

async function sendMessage(app, text, mdText, channels) {
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
              text: mdText,
            },
          },
        ],
      })
    })
  )
}

export async function sendIssueUpdated(app, channels, node) {
  const { text, mdText } = issueUpdatedMessage(node)
  return sendMessage(app, text, mdText, channels)
}

export async function sendDraftIssueCreated(app, channels, node) {
  const { text, mdText } = draftIssueCreatedMessage(node)
  return sendMessage(app, text, mdText, channels)
}

export async function sendIssueCreated(app, channels, node) {
  const { text, mdText } = issueCreatedMessage(node)
  return sendMessage(app, text, mdText, channels)
}

export async function sendIssueDeleted(app, channels, node) {
  const { text, mdText } = issueDeletedMessage(node)
  return sendMessage(app, text, mdText, channels)
}

export async function sendPullRequestCreated(app, channels, node) {
  const { text, mdText } = pullRequestCreatedMessage(node)
  return sendMessage(app, text, mdText, channels)
}

export async function sendPullRequestDeleted(app, channels, node) {
  const { text, mdText } = pullRequestDeletedMessage(node)
  return sendMessage(app, text, mdText, channels)
}
