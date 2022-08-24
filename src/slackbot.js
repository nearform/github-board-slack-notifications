import {
  issueUpdatedMessage,
  draftIssueCreatedMessage,
  issueCreatedMessage,
  issueDeletedMessage,
  pullRequestCreatedMessage,
  pullRequestDeletedMessage,
  pullRequestUpdatedMessage,
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

export async function sendIssueUpdated(app, channels, payload) {
  const { text, mdText } = issueUpdatedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}
export async function sendPullRequestUpdated(app, channels, payload) {
  const { text, mdText } = pullRequestUpdatedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}

export async function sendDraftIssueCreated(app, channels, payload) {
  const { text, mdText } = draftIssueCreatedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}

export async function sendIssueCreated(app, channels, payload) {
  const { text, mdText } = issueCreatedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}

export async function sendIssueDeleted(app, channels, payload) {
  const { text, mdText } = issueDeletedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}

export async function sendPullRequestCreated(app, channels, payload) {
  const { text, mdText } = pullRequestCreatedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}

export async function sendPullRequestDeleted(app, channels, payload) {
  const { text, mdText } = pullRequestDeletedMessage(payload)
  return sendMessage(app, text, mdText, channels)
}
