'use strict'
import sinon from 'sinon'
import * as slackbot from '../src/slackbot.js'

import { test } from 'tap'

test('test slackbot', async t => {
  // test data
  const issueUrl = 'https://github.com/test-org/test-repo/issues/1'
  const issueNumber = 1
  const title = 'Test issue'
  const column = 'Done'
  const projectUrl = 'https://github.com/orgs/test-org/projects/1/views/1'
  const channels = ['general']
  const stub = sinon.stub()
  const slackApp = {
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
    sinon.restore()
  })
  t.test('sendIssueUpdated', async t => {
    const response = await slackbot.sendIssueUpdated(slackApp, {
      issueUrl,
      issueNumber,
      title,
      column,
      projectUrl,
      channels,
    })
    t.equal(stub.callCount, 1)
    t.same(response, [
      {
        channel: channels.pop(),
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `<${issueUrl}|#${issueNumber} ${title}> has been moved to <${projectUrl}|${column}>`,
            },
          },
        ],
      },
    ])
  })
})
