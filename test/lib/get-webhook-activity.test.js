'use strict'

import { test } from 'tap'
import * as webhook from '../../lib/get-webhook-activity.js'
import itemCreatedFromIssue from '../fixtures/webhook/item_created_from_issue.js'
import itemCreated from '../fixtures/webhook/item_created.js'
import itemMovedToInProgress from '../fixtures/webhook/item_moved_no_status_to_in_progress.js'
import itemMovedToTodo from '../fixtures/webhook/item_moved_no_status_to_todo.js'
import itemAssigneeAdded from '../fixtures/webhook/item_assignee_added.js'

test('get webhook activity', async t => {
  t.test('returns null with unmatched activity', async t => {
    const result = webhook.getActivity({
      action: 'unknown',
      projects_v2_item: {
        content_type: 'unknown',
        changes: {
          field_value: {
            field_type: 'assignees',
          },
        },
      },
    })
    t.equal(result, null)
  })

  t.test('returns "ISSUE_CREATED" with a valid payload', async t => {
    t.equal(webhook.getActivity(itemCreatedFromIssue), webhook.ISSUE_CREATED)
    t.equal(webhook.getActivity(itemCreated), webhook.ISSUE_CREATED)
  })

  t.test('returns "ISSUE_MOVED" with a valid payload', async t => {
    t.equal(webhook.getActivity(itemMovedToInProgress), webhook.ISSUE_MOVED)
    t.equal(webhook.getActivity(itemMovedToTodo), webhook.ISSUE_MOVED)
  })

  t.test('returns "ISSUE_ASSIGNEES" with a valid payload', async t => {
    t.equal(webhook.getActivity(itemAssigneeAdded), webhook.ISSUE_ASSIGNEES)
  })
})
