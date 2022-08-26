export function getChangesMessage({ actionConfig, changes }) {
  const { changes: changesConfig } = actionConfig
  const { message } = changesConfig[changes.field_value?.field_type]
  return { message }
}

export function getRawMessage({ actionConfig, changes }) {
  const { message } = isValidChange({ actionConfig, changes })
    ? getChangesMessage({ actionConfig, changes })
    : actionConfig
  return message
}

function isValidChange({ actionConfig, changes }) {
  return (
    Object.hasOwn(actionConfig, 'changes') &&
    changes?.field_value?.field_type in actionConfig['changes']
  )
}

export function formatMessage({ content_type, node, message }) {
  const {
    creator: { url: creatorUrl, login: creatorName },
    project: { number, url: projectUrl, title: projectName },
    content: {
      author: { url: authorUrl, name: authorName },
      title,
      url: itemUrl,
      number: itemNumber,
    },
  } = node
  return replaceKeys(message, {
    authorUrl: authorUrl ? authorUrl : creatorUrl,
    number,
    authorName: authorName ? authorName : creatorName,
    projectUrl,
    itemUrl,
    itemNumber,
    projectName,
    title: escapeMarkdown(title),
    content_type,
  })
}

function replaceKeys(message, valuesToReplace) {
  return Object.entries(valuesToReplace).reduce((acc, [key, value]) => {
    return acc.replace(`{${key}}`, value)
  }, message)
}

export const markdownEscapes = [
  {
    regex: /\*/g,
    replacement: '\\*',
  },
  {
    regex: /#/g,
    replacement: '\\#',
  },
  {
    regex: /\//g,
    replacement: '\\/',
  },
  {
    regex: /\(/g,
    replacement: '\\(',
  },
  {
    regex: /\)/g,
    replacement: '\\)',
  },
  {
    regex: /\[/g,
    replacement: '\\[',
  },
  {
    regex: /\]/g,
    replacement: '\\]',
  },
  {
    regex: /</g,
    replacement: '&lt;',
  },
  {
    regex: />/g,
    replacement: '&gt;',
  },
  {
    regex: /_/g,
    replacement: '\\_',
  },
]

export function escapeMarkdown(text) {
  return markdownEscapes.reduce((acc, { regex, replacement }) => {
    return acc.replace(regex, replacement)
  }, text)
}
