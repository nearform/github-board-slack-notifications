'use strict'

import { test } from 'tap'
import * as webhook from '../../lib/get-webhook-activity.js'
import itemCreatedFromIssue from '../fixtures/webhook/itemCreatedFromIssue.js'
import itemCreated from '../fixtures/webhook/itemCreated.js'
import itemMovedToInProgress from '../fixtures/webhook/itemMovedNoStatusToInProgress.js'
import itemMovedToTodo from '../fixtures/webhook/itemMovedNoStatusToTodo.js'
import itemAssigneeAdded from '../fixtures/webhook/itemAssigneeAdded.js'

test('get webhook activity', async t => {
  t.test('returns null with unmatched activity', async t => {
    t.equal(
      webhook.getActivity({
        action: 'unknown',
        projects_v2_item: {
          content_type: 'unknown',
        },
        changes: {
          field_value: {
            field_type: 'assignees',
          },
        },
      }),
      null
    )
    t.equal(
      webhook.getActivity({
        action: 'unkown',
        projects_v2_item: {
          content_type: 'Issue',
        },
        changes: {
          field_value: {
            field_type: 'assignees',
          },
        },
      }),
      null
    )
    t.equal(
      webhook.getActivity({
        action: 'edited',
        projects_v2_item: {
          content_type: 'Issue',
        },
        changes: {
          field_value: {
            field_type: 'unknown',
          },
        },
      }),
      null
    )
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
