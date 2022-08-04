'use strict'

export const ISSUE_MOVED = 'ISSUE_MOVED',
  ISSUE_CREATED = 'ISSUE_CREATED',
  ISSUE_ASSIGNEES = 'ISSUE_ASSIGNEES'

export function getActivity(webhookPayload) {
  const {
    action,
    projects_v2_item: { content_type },
    changes,
  } = webhookPayload

  if (content_type !== 'Issue') {
    return null
  }

  if (
    action === 'created' ||
    (action === 'converted' && changes.content_type?.to === 'Issue')
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
