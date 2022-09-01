import { getChangedItem } from './graphql.js'

export async function getChangesMessage({ actionConfig, changes, request }) {
  const { changes: changesConfig } = actionConfig
  const { message } = changesConfig[changes.field_value?.field_type]
  return { message: await prepareChangeMessage({ changes, request, message }) }
}

export async function prepareChangeMessage({ changes, request, message }) {
  const {
    field_value: { field_node_id },
  } = changes
  const {
    node: { name: changed_field },
  } = await getChangedItem({
    graphqlClient: await request.authenticateGraphql(),
    id: field_node_id,
  })
  return replaceKeys(message, { changed_field })
}

export async function getRawMessage({ actionConfig, changes, request }) {
  const { message } = isValidChange({ actionConfig, changes })
    ? await getChangesMessage({ actionConfig, changes, request })
    : actionConfig
  return message
}

function isValidChange({ actionConfig, changes }) {
  return (
    Object.hasOwn(actionConfig, 'changes') &&
    changes?.field_value?.field_type in actionConfig['changes']
  )
}

export function parseAssignees(assignees) {
  return assignees &&
    Object.hasOwn(assignees, 'nodes') &&
    Array.isArray(assignees.nodes)
    ? assignees.nodes.map(assignee => assignee?.name)
    : []
}

export function formatMessage({ content_type, node, message, extra }) {
  const {
    creator: { url: creatorUrl, login: creatorName },
    project: { number, url: projectUrl, title: projectName },
    content: {
      assignees,
      author: { url: authorUrl, name: authorName },
      title,
      url: itemUrl,
      number: itemNumber,
    },
    fieldValueByName: { name: updated_value },
  } = node
  return replaceKeys(message, {
    authorUrl: authorUrl ? authorUrl : creatorUrl,
    number,
    authorName: authorName ? authorName : creatorName,
    projectUrl,
    itemUrl,
    updated_value,
    itemNumber,
    projectName,
    title: escapeMarkdown(title),
    content_type,
    assignees: parseAssignees(assignees),
    ...extra,
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
  }, text || '')
}
