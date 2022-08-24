'use strict'
import sinon from 'sinon'
import * as slackbot from '../src/slackbot.js'
import {
  pullRequestDeletedMessage,
  pullRequestCreatedMessage,
  issueDeletedMessage,
  issueCreatedMessage,
  draftIssueCreatedMessage,
  issueUpdatedMessage,
  pullRequestMovedMessage,
} from '../src/messages.js'

import { test } from 'tap'

test('test slackbot', async t => {
  // test data
  const issueUrl = 'https://github.com/test-org/test-repo/issues/1',
    issueNumber = 1,
    prNumber = 1,
    prTitle = 'Test pull request',
    prUrl = 'https://github.com/test-org/test-repo/pull/1',
    title = 'Test issue',
    column = 'Done',
    projectUrl = 'https://github.com/orgs/test-org/projects/1/views/1',
    channels = ['general'],
    authorUrl = 'https://github.com/testuser',
    authorName = 'testuser',
    projectName = 'Test Board',
    stub = sinon.stub(),
    slackApp = {
      client: {
        chat: {
          postMessage: params => {
            stub()
            return params
          },
        },
      },
    }

  t.afterEach(() => {
    sinon.reset()
  })

  t.test('sendIssueUpdated', async t => {
    const payload = {
      issueUrl,
      issueNumber,
      title,
      column,
      projectUrl,
      isDraft: false,
    }
    const response = await slackbot.sendIssueUpdated(
      slackApp,
      channels,
      payload
    )
    t.equal(stub.callCount, 1)
    const { text, mdText } = issueUpdatedMessage(payload)
    t.same(response, [
      {
        text: text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })

  t.test('sendIssueCreated', async t => {
    const payload = {
      authorUrl,
      authorName,
      title,
      issueNumber,
      issueUrl,
      projectUrl,
      projectName,
    }
    const response = await slackbot.sendIssueCreated(
      slackApp,
      channels,
      payload
    )
    t.equal(stub.callCount, 1)
    const { text, mdText } = issueCreatedMessage(payload)
    t.same(response, [
      {
        text: text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })
  t.test('sendDraftIssueCreated', async t => {
    const payload = {
      authorUrl,
      authorName,
      title,
      projectName,
      projectUrl,
    }
    const response = await slackbot.sendDraftIssueCreated(
      slackApp,
      channels,
      payload
    )
    t.equal(stub.callCount, 1)
    const { text, mdText } = draftIssueCreatedMessage(payload)
    t.same(response, [
      {
        text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })
  t.test('sendIssueDeleted', async t => {
    const payload = {
      title,
      issueNumber,
      projectUrl,
      projectName,
      isDraft: false,
    }
    const response = await slackbot.sendIssueDeleted(
      slackApp,
      channels,
      payload
    )
    t.equal(stub.callCount, 1)
    const { text, mdText } = issueDeletedMessage(payload)
    t.same(response, [
      {
        text: text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })

  t.test('sendPullRequestCreated', async t => {
    const payload = {
      authorUrl,
      authorName,
      title: prTitle,
      prNumber,
      prUrl,
      projectUrl,
      projectName,
    }
    const response = await slackbot.sendPullRequestCreated(
      slackApp,
      channels,
      payload
    )

    t.equal(stub.callCount, 1)
    const { text, mdText } = pullRequestCreatedMessage(payload)
    t.same(response, [
      {
        text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })

  t.test('sendPullRequestDeleted', async t => {
    const payload = {
      title: prTitle,
      prNumber,
      projectUrl,
      projectName,
    }
    const response = await slackbot.sendPullRequestDeleted(
      slackApp,
      channels,
      payload
    )
    t.equal(stub.callCount, 1)
    const { text, mdText } = pullRequestDeletedMessage(payload)
    t.same(response, [
      {
        text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })

  t.test('sendPullRequestMoved', async t => {
    const payload = {
      title: prTitle,
      prNumber,
      projectUrl,
      projectName,
      column,
    }
    const response = await slackbot.sendPullRequestUpdated(
      slackApp,
      channels,
      payload
    )
    t.equal(stub.callCount, 1)
    const { text, mdText } = pullRequestMovedMessage(payload)
    t.same(response, [
      {
        text,
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: mdText,
            },
          },
        ],
      },
    ])
  })
})
