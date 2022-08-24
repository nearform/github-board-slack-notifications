export function issueIsDraft({ isDraft, title, issueUrl, issueNumber }) {
  return {
    itemMdText: isDraft
      ? `Draft issue _${title}_`
      : `Issue <${issueUrl}|#${issueNumber} ${title}>`,
    itemText: isDraft
      ? `Draft issue _${title}_`
      : `Issue #${issueNumber} ${title}`,
  }
}

export function issueUpdatedMessage({
  issueUrl,
  issueNumber,
  title,
  column,
  projectUrl,
  isDraft,
}) {
  const { itemMdText, itemText } = issueIsDraft({
    isDraft,
    title,
    issueUrl,
    issueNumber,
  })
  return {
    text: `💡 ${itemText} has been moved to ${column} 🌈`,
    mdText: `💡 ${itemMdText} has been moved to <${projectUrl}|${column}> 🌈`,
  }
}

export function draftIssueCreatedMessage({
  authorUrl,
  authorName,
  title,
  projectName,
  projectUrl,
}) {
  return {
    text: `💡 ${authorName} has a created a draft issue titled _${title}_ in ${projectName} 📝`,
    mdText: `💡 <${authorUrl}|${authorName}> has a created a draft issue titled _${title}_ in <${projectUrl}| ${projectName}> 📝`,
  }
}

export function issueCreatedMessage({
  authorUrl,
  authorName,
  title,
  issueNumber,
  issueUrl,
  projectUrl,
  projectName,
}) {
  return {
    text: `💡 ${authorName} has a created an issue titled _#${issueNumber} ${title}_ in ${projectName} ➕️`,
    mdText: `💡 <${authorUrl}| ${authorName}> has a created an issue titled _<${issueUrl}| #${issueNumber} ${title}>_ in <${projectUrl}| ${projectName}> ➕️`,
  }
}

export function issueDeletedMessage({
  title,
  issueNumber,
  projectUrl,
  projectName,
  isDraft,
}) {
  const { itemText } = issueIsDraft({
    isDraft,
    title,
    issueNumber,
  })
  return {
    text: `💡 ${itemText} has been deleted from ${projectName} ❌`,
    mdText: `💡 ${itemText} has been deleted from <${projectUrl}| ${projectName}> ❌`,
  }
}

export function pullRequestCreatedMessage({
  authorUrl,
  authorName,
  title,
  prNumber,
  prUrl,
  projectUrl,
  projectName,
}) {
  return {
    text: `💡 ${authorName} has a created a Pull Request titled _#${prNumber} ${title}_ in ${projectName} ➕️`,
    mdText: `💡 <${authorUrl}| ${authorName}> has a created a Pull Request titled _<${prUrl}| #${prNumber} ${title}>_ in <${projectUrl}| ${projectName}> ➕️`,
  }
}

export function pullRequestDeletedMessage({
  prNumber,
  title,
  projectName,
  projectUrl,
}) {
  return {
    text: `💡 Pull Request _#${prNumber} ${title}_ has been deleted from ${projectName} ❌`,
    mdText: `💡 Pull Request _#${prNumber} ${title}_ has been deleted from <${projectUrl}| ${projectName}> ❌`,
  }
}

export function pullRequestUpdatedMessage({
  prNumber,
  title,
  column,
  projectUrl,
}) {
  return {
    text: `💡 Pull Request _#${prNumber} ${title}_ has been moved to ${column} 🌈`,
    mdText: `💡 Pull Request _#${prNumber} ${title}_ has been moved to <${projectUrl}| ${column}> 🌈`,
  }
}
