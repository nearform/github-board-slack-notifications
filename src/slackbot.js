/* eslint-disable no-unused-vars */
export async function sendIssueUpdated(
  app,
  { issueUrl, issueNumber, title, column, projectUrl, channels }
) {
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
export async function sendDraftIssueCreated(
  slackApp,
  { authorUrl, authorUsername, title, column, channels }
) {}
export async function sendIssueCreated(
  slackApp,
  { authorUrl, authorUsername, title, column, issueUrl, channels }
) {}

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
