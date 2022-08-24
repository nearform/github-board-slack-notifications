'use strict'

export const ISSUE_MOVED = 'ISSUE_MOVED',
  ISSUE_CREATED = 'ISSUE_CREATED',
  ISSUE_ASSIGNEES = 'ISSUE_ASSIGNEES',
  ISSUE_DELETED = 'ISSUE_DELETED',
  DRAFT_CREATED = 'DRAFT_CREATED',
  PR_CREATED = 'PR_CREATED',
  PR_DELETED = 'PR_DELETED',
  PR_ASSIGNEES = 'PR_ASSIGNEES',
  PR_MOVED = 'PR_MOVED'

export const CONTENT_TYPE_DRAFT_ISSUE = 'DraftIssue',
  CONTENT_TYPE_ISSUE = 'Issue',
  CONTENT_TYPE_PR = 'PullRequest'

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

  switch (action) {
    case ACTION_TYPE_DELETED:
      return deletedActivity({ content_type })
    case ACTION_TYPE_CONVERTED:
      return convertedActivity({ content_type, changes })
    case ACTION_TYPE_CREATED:
      return createdActivity({ content_type })
    case ACTION_TYPE_EDITED:
      return editedActivity({ content_type, changes })
    default:
      break
  }
}

function deletedActivity({ content_type }) {
  switch (content_type) {
    case CONTENT_TYPE_PR:
      return PR_DELETED
    case CONTENT_TYPE_ISSUE:
      return ISSUE_DELETED
    default:
      break
  }
}

function createdActivity({ content_type }) {
  switch (content_type) {
    case CONTENT_TYPE_PR:
      return PR_CREATED
    case CONTENT_TYPE_ISSUE:
      return ISSUE_CREATED
    case CONTENT_TYPE_DRAFT_ISSUE:
      return DRAFT_CREATED
    default:
      break
  }
}

function convertedActivity({ changes }) {
  return changes.content_type?.to === CONTENT_TYPE_ISSUE
    ? ISSUE_CREATED
    : undefined
}

function editedActivity({ content_type, changes }) {
  switch (content_type) {
    case CONTENT_TYPE_ISSUE:
      if (changes.field_value?.field_type === FIELD_TYPE_SINGLE_SELECT) {
        return ISSUE_MOVED
      }

      if (changes.field_value?.field_type === FIELD_TYPE_ASSIGNEES) {
        return ISSUE_ASSIGNEES
      }

      break
    case CONTENT_TYPE_PR:
      if (changes.field_value?.field_type === FIELD_TYPE_ASSIGNEES)
        return PR_ASSIGNEES
      if (changes.field_value?.field_type === FIELD_TYPE_SINGLE_SELECT) {
        return PR_MOVED
      }
      break
    default:
      break
  }
}
