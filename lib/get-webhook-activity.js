'use strict'

export const ISSUE_MOVED = 'ISSUE_MOVED',
  ISSUE_CREATED = 'ISSUE_CREATED',
  ISSUE_ASSIGNEES = 'ISSUE_ASSIGNEES',
  ISSUE_DELETED = 'ISSUE_DELETED',
  DRAFT_CREATED = 'DRAFT_CREATED'

export const CONTENT_TYPE_DRAFT_ISSUE = 'DraftIssue',
  CONTENT_TYPE_ISSUE = 'Issue'

export const ACTION_TYPE_CREATED = 'created',
  ACTION_TYPE_DELETED = 'deleted',
  ACTION_TYPE_CONVERTED = 'converted',
  ACTION_TYPE_EDITED = 'edited'

export const FIELD_TYPE_SINGLE_SELECT = 'single_select',
  FIELD_TYPE_ASSIGNEES = 'assignees'

export function getActivity(webhookPayload) {
  const {
    action,
    projects_v2_item: { content_type },
    changes,
  } = webhookPayload

  if (
    content_type !== CONTENT_TYPE_ISSUE &&
    content_type !== CONTENT_TYPE_DRAFT_ISSUE
  ) {
    return null
  }

  if (action === ACTION_TYPE_DELETED) {
    return ISSUE_DELETED
  }

  if (
    action === ACTION_TYPE_CREATED &&
    content_type === CONTENT_TYPE_DRAFT_ISSUE
  ) {
    return DRAFT_CREATED
  }

  if (
    (action === ACTION_TYPE_CONVERTED &&
      changes.content_type?.to === CONTENT_TYPE_ISSUE) ||
    (action === ACTION_TYPE_CREATED && content_type === CONTENT_TYPE_ISSUE)
  ) {
    return ISSUE_CREATED
  }

  if (action === ACTION_TYPE_EDITED) {
    // This refers to the status field of an item changing e.g. TODO -> In Progress
    if (changes.field_value?.field_type === FIELD_TYPE_SINGLE_SELECT) {
      return ISSUE_MOVED
    }

    if (changes.field_value?.field_type === FIELD_TYPE_ASSIGNEES) {
      return ISSUE_ASSIGNEES
    }
  }

  return null
}
