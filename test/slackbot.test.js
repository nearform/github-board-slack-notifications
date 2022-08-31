'use strict'
import sinon from 'sinon'
import {
  generateRandomString,
  isMarkdownEscapeValid,
  isMessageValid,
} from './helper.js'
import { escapeMarkdown, formatMessage } from '../src/messages.js'
import { test } from 'tap'
import itemCreated from './fixtures/webhook/itemCreated.js'
import * as slackbot from '../src/slackbot.js'
import { notificationConfig } from '../src/config.js'

test('test slackbot', async t => {
  // test data
  const fixtures = [itemCreated]
  const node = {
    creator: {
      url: 'https://api.github.com/users/some-github-user',
      login: 'some-github-user',
    },
    project: {
      number: '1',
      url: 'https://github.com/orgs/some-project/projects',
      title: 'project-name',
    },
    content: {
      author: {
        url: 'https://api.github.com/users/JohanX',
        name: 'some-author-name',
      },
      title: 'some-title',
      url: 'https://api.github.com/users/some-github-user',
      number: '1',
    },
  }

  t.afterEach(() => {
    sinon.reset()
  })

  t.test('content_type is retrieved correctly', async t => {
    for (const fixture of fixtures) {
      const {
        projects_v2_item: { content_type },
      } = fixture

      const contentType = slackbot.getContentType({
        body: fixture,
      })
      t.equal(content_type, contentType)
    }
  })

  t.test('check no changes messages are formatted correctly', async t => {
    const { actions } = notificationConfig
    for (const [key, value] of Object.entries(actions)) {
      const { message } = value
      const formattedMessage = formatMessage({
        content_type: key,
        node,
        message,
      })
      t.equal(true, isMessageValid(formattedMessage))
    }
  })

  t.test('markdown is escaped correctly', async t => {
    const testString = escapeMarkdown(generateRandomString(50))
    const isValid = isMarkdownEscapeValid(testString)
    t.equal(isValid, true)
  })
})
