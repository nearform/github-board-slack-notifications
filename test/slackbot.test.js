'use strict'
import sinon from 'sinon'
import * as slackbot from '../src/slackbot.js'

import { test } from 'tap'

test('test slackbot', async t => {
  // test data
  const issueUrl = 'https://github.com/test-org/test-repo/issues/1',
    issueNumber = 1,
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
    const response = await slackbot.sendIssueUpdated(slackApp, {
      issueUrl,
      issueNumber,
      title,
      column,
      projectUrl,
      channels,
      isDraft: false,
    })
    t.equal(stub.callCount, 1)
    t.same(response, [
      {
        text: '💡 Issue #1 Test issue has been moved to Done 🌈',
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '💡 Issue <https://github.com/test-org/test-repo/issues/1|#1 Test issue> has been moved to <https://github.com/orgs/test-org/projects/1/views/1|Done> 🌈',
            },
          },
        ],
      },
    ])
  })

  t.test('sendIssueCreated', async t => {
    const response = await slackbot.sendIssueCreated(slackApp, {
      authorUrl,
      authorName,
      title,
      issueNumber,
      issueUrl,
      projectUrl,
      projectName,
      channels,
    })
    t.equal(stub.callCount, 1)
    t.same(response, [
      {
        text: '💡 testuser has a created an issue titled _#1 Test issue_ in Test Board ➕️',
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                '💡 <https://github.com/testuser|testuser> has a created an issue titled ' +
                '_<https://github.com/test-org/test-repo/issues/1|#1 Test issue>_ in ' +
                '<https://github.com/orgs/test-org/projects/1/views/1|Test Board> ➕️',
            },
          },
        ],
      },
    ])
  })
  t.test('sendDraftIssueCreated', async t => {
    const response = await slackbot.sendDraftIssueCreated(slackApp, {
      authorUrl,
      authorName,
      title,
      projectName,
      projectUrl,
      channels,
    })
    t.equal(stub.callCount, 1)
    t.same(response, [
      {
        text: '💡 testuser has a created a draft issue titled _Test issue_ in Test Board 📝',
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                '💡 <https://github.com/testuser|testuser> has a created a draft issue titled _Test issue_ in ' +
                '<https://github.com/orgs/test-org/projects/1/views/1|Test Board> 📝',
            },
          },
        ],
      },
    ])
  })
  t.test('sendIssueDeleted', async t => {
    const response = await slackbot.sendIssueDeleted(slackApp, {
      title,
      issueNumber,
      projectUrl,
      projectName,
      channels,
      isDraft: false,
    })
    t.equal(stub.callCount, 1)
    t.same(response, [
      {
        text: '💡 Issue _#1 Test issue_ has been deleted from Test Board ❌',
        channel: channels[0],
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                '💡 Issue _#1 Test issue_ has been deleted from ' +
                '<https://github.com/orgs/test-org/projects/1/views/1|Test Board> ❌',
            },
          },
        ],
      },
    ])
  })
})
