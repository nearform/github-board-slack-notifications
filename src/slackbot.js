async function sendMessage(app, text, mdText, channels) {
  return await Promise.all(
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

export async function sendIssueUpdated(
  app,
  { issueUrl, issueNumber, title, column, projectUrl, channels, isDraft }
) {
  const itemMdText = isDraft
    ? `Draft issue _${title}_`
    : `Issue <${issueUrl}|#${issueNumber} ${title}>`
  const itemText = isDraft
    ? `Draft issue _${title}_`
    : `Issue #${issueNumber} ${title}`
  const text = `💡 ${itemText} has been moved to ${column} 🌈`
  const mdText = `💡 ${itemMdText} has been moved to <${projectUrl}|${column}> 🌈`
  return await sendMessage(app, text, mdText, channels)
}

export async function sendDraftIssueCreated(
  app,
  { authorUrl, authorName, title, projectName, projectUrl, channels }
) {
  const text = `💡 ${authorName} has a created a draft issue titled _${title}_ in ${projectName} 📝`
  const mdText = `💡 <${authorUrl}|${authorName}> has a created a draft issue titled _${title}_ in <${projectUrl}|${projectName}> 📝`
  return await sendMessage(app, text, mdText, channels)
}

export async function sendIssueCreated(
  app,
  {
    authorUrl,
    authorName,
    title,
    issueNumber,
    issueUrl,
    projectUrl,
    projectName,
    channels,
  }
) {
  const text = `💡 ${authorName} has a created an issue titled _#${issueNumber} ${title}_ in ${projectName} ➕️`
  const mdText = `💡 <${authorUrl}|${authorName}> has a created an issue titled _<${issueUrl}|#${issueNumber} ${title}>_ in <${projectUrl}|${projectName}> ➕️`
  return await sendMessage(app, text, mdText, channels)
}

export async function sendIssueDeleted(
  app,
  { title, issueNumber, projectUrl, projectName, channels, isDraft }
) {
  const itemText = isDraft
    ? `Draft issue _${title}_`
    : `Issue _#${issueNumber} ${title}_`
  const text = `💡 ${itemText} has been deleted from ${projectName} ❌`
  const mdText = `💡 ${itemText} has been deleted from <${projectUrl}|${projectName}> ❌`
  return await sendMessage(app, text, mdText, channels)
}

export async function sendPullRequestCreated(
  app,
  {
    authorUrl,
    authorName,
    title,
    prNumber,
    prUrl,
    projectUrl,
    projectName,
    channels,
  }
) {
  const text = `💡 ${authorName} has a created a Pull Request titled _#${prNumber} ${title}_ in ${projectName} ➕️`
  const mdText = `💡 <${authorUrl}|${authorName}> has a created a Pull Request titled _<${prUrl}|#${prNumber} ${title}>_ in <${projectUrl}|${projectName}> ➕️`
  return sendMessage(app, text, mdText, channels)
}

export async function sendPullRequestDeleted(
  app,
  { title, prNumber, projectUrl, projectName, channels }
) {
  const text = `💡 Pull Request _#${prNumber} ${title}_ has been deleted from ${projectName} ❌`
  const mdText = `💡 Pull Request _#${prNumber} ${title}_ has been deleted from <${projectUrl}|${projectName}> ❌`
  return sendMessage(app, text, mdText, channels)
}
