import pkg from '@slack/bolt'
import config from './config.js'
const { App } = pkg

// Initializes your app with your bot token and signing secret
const app = new App({
  token: config.SLACK_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
})

export async function sendIssueUpdated({
  link,
  title,
  previousStatus,
  nextStatus,
}) {
  // https://slack.dev/bolt-js/concepts#web-api
  return await app.client.chat.postMessage({
    channel: config.SLACK_CHANNEL,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Issue: <${link}|${title}> was moved from ${previousStatus} to ${nextStatus}`,
        },
      },
    ],
  })
}

export async function sendDraftIssueCreated({ creator, column, title }) {
  // https://slack.dev/bolt-js/concepts#web-api
  return await app.client.chat.postMessage({
    channel: config.SLACK_CHANNEL,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:warning: A *draft*, ${title} has been created and added to the column, ${column}, by <https://github.com/${creator}|${creator}>`,
        },
      },
    ],
  })
}

export async function sendIssueCreated({ creator, column, title, issueLink }) {
  // https://slack.dev/bolt-js/concepts#web-api
  return await app.client.chat.postMessage({
    channel: config.SLACK_CHANNEL,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:white_check_mark: <${issueLink}|${title}> has been created and added to the column, ${column}, by <https://github.com/${creator}|${creator}>`,
        },
      },
    ],
  })
}

/**
 * Example usage
 */
// (async () => {
//   await sendIssueUpdated({
//     link: 'www.github.com',
//     title: 'some issue',
//     previousStatus: 'TODO',
//     nextStatus: 'Closed',
//   })
// })()
