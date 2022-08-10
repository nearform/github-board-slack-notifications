import pkg from '@slack/bolt'
import config from './config.js'
const { App } = pkg

// Initializes your app with your bot token and signing secret
const app = new App({
  token: config.SLACK_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
})

export async function sendIssueUpdated({
  issueUrl,
  issueNumber,
  title,
  column,
  projectUrl,
  channels,
}) {
  return await Promise.all(
    channels.map(channel =>
      app.client.chat.postMessage({
        channel,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<${issueUrl}|#${issueNumber} ${title}> has been moved to <${projectUrl}|${column}>`,
            },
          },
        ],
      })
    )
  )
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
