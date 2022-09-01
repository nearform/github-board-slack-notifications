'use strict'

import sinon from 'sinon'
import { test } from 'tap'
import { createSignature } from '../../lib/verify-request.js'
import config from '../../src/config.js'
import getProjectItemByIdResponse from '../fixtures/graphql/getProjectItemByIdResponse.js'
import itemCreated from '../fixtures/webhook/itemCreated.js'
import itemDeleted from '../fixtures/webhook/itemDeleted.js'
import itemMovedNoStatusToTodo from '../fixtures/webhook/itemMovedNoStatusToTodo.js'
import pullRequestCreated from '../fixtures/webhook/pullRequestCreated.js'
import pullRequestDeleted from '../fixtures/webhook/pullRequestDeleted.js'
import pullRequestMoved from '../fixtures/webhook/pullRequestMoved.js'
import itemInvalidNodeId from '../fixtures/webhook/itemInvalidNodeId.js'
import { build } from '../helper.js'

test('POST /webhook', async t => {
  t.afterEach(() => {
    sinon.reset()
  })
  t.test('returns 400 with invalid payload', async t => {
    const app = await build(t)

    const res = await app.inject({
      url: '/webhook',
      method: 'POST',
      body: '',
    })
    t.equal(res.statusCode, 400)
  })
  t.test('returns 400 with missing required payload', async t => {
    const app = await build(t)

    const res = await app.inject({
      url: '/webhook',
      method: 'POST',
      body: {
        action: 'created',
      },
    })
    t.equal(res.statusCode, 400)
  })
  t.test(
    'returns 401 with valid payload but missing X-Hub-Signature-256',
    async t => {
      const app = await build(t)

      const res = await app.inject({
        url: '/webhook',
        method: 'POST',
        body: {
          action: 'created',
          projects_v2_item: {
            id: 15,
            node_id: 'PVTI_lAAEAQ8',
            project_node_id: 'PVT_kwAEAQ',
            content_node_id: 'DI_lAAEAQo',
            content_type: 'DraftIssue',
            created_at: '2022-05-20T21:20:57Z',
            updated_at: '2022-05-20T21:20:57Z',
            archived_at: null,
            creator: {
              login: 'john_doe',
              html_url: 'www.github.com/john_doe',
            },
          },
          installation: {
            id: 123,
          },
        },
      })

      t.equal(res.statusCode, 401)
    }
  )
  t.test(
    'sends graphql and slack bot requests with valid payloads:',
    async t => {
      const slackStub = sinon.stub()
      const app = await build(t, {
        // the authentication function returns a function
        graphqlClient: async () => () => {
          return getProjectItemByIdResponse
        },
        slackApp: async function slackApp() {
          return {
            client: {
              chat: {
                postMessage: params => {
                  slackStub()
                  return params
                },
              },
            },
          }
        },
      })
      t.test('item created', async t => {
        const signature = createSignature(
          itemCreated,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemCreated,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(res.statusCode, 200)
      })
      t.test('item updated', async t => {
        const signature = createSignature(
          itemMovedNoStatusToTodo,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemMovedNoStatusToTodo,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(slackStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })
      t.test('item deleted', async t => {
        const signature = createSignature(
          itemDeleted,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemDeleted,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(slackStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })

      t.test('pr created', async t => {
        const signature = createSignature(
          pullRequestCreated,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: pullRequestCreated,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(res.statusCode, 200)
      })

      t.test('pr deleted', async t => {
        const signature = createSignature(
          pullRequestDeleted,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: pullRequestDeleted,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(slackStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })

      /**
       * the request should be ignored because it is of type reordered
       */
      t.test('pr moved', async t => {
        const signature = createSignature(
          pullRequestMoved,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: pullRequestMoved,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(slackStub.callCount, 0)
        t.equal(res.statusCode, 200)
      })

      t.test('item with a non existent node_id', async t => {
        const signature = createSignature(
          itemInvalidNodeId,
          config.ORG_WEBHOOK_SECRET
        )
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemInvalidNodeId,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(slackStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })
    }
  )
})
