'use strict'

export const ISSUE_MOVED = 'ISSUE_MOVED',
  ISSUE_CREATED = 'ISSUE_CREATED',
  ISSUE_ASSIGNEES = 'ISSUE_ASSIGNEES',
  ISSUE_DELETED = 'ISSUE_DELETED',
  DRAFT_CREATED = 'DRAFT_CREATED'

export const MORE_INFO_NEEDED = []

export function getActivity(webhookPayload) {
  const {
    action,
    projects_v2_item: { content_type },
    changes,
  } = webhookPayload

  if (content_type !== 'Issue' && content_type !== 'DraftIssue') {
    return null
  }

  if (action === 'deleted') {
    return ISSUE_DELETED
  }

  if (action === 'created' && content_type !== 'Issue') {
    return DRAFT_CREATED
  }

  if (
    (action === 'converted' && changes.content_type?.to === 'Issue') ||
    (action === 'created' && content_type === 'Issue')
  ) {
    return ISSUE_CREATED
  }

  if (action === 'edited') {
    // This refers to the status field of an item changing e.g. TODO -> In Progress
    if (changes.field_value?.field_type === 'single_select') {
      return ISSUE_MOVED
    }

    if (changes.field_value?.field_type === 'assignees') {
      return ISSUE_ASSIGNEES
    }
  }

  return null
}
