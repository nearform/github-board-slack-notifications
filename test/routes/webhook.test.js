'use strict'

import { test } from 'tap'

import { build } from '../helper.js'
import config from '../../src/config.js'
import { createSignature } from '../../lib/verify-request.js'
import sinon from 'sinon'
import itemCreated from '../fixtures/webhook/itemCreated.js'
import itemMovedNoStatusToTodo from '../fixtures/webhook/itemMovedNoStatusToTodo.js'
import itemDeleted from '../fixtures/webhook/itemDeleted.js'

test('POST /webhook', async t => {
  t.afterEach(() => {
    sinon.restore()
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
  t.test('returns 200 with valid payload and header', async t => {
    const app = await build(t)
    const body = {
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
    }
    const signature = createSignature(body, config.ORG_WEBHOOK_SECRET)
    const res = await app.inject({
      url: '/webhook',
      method: 'POST',
      body,
      headers: {
        'X-Hub-Signature-256': signature,
      },
    })

    t.equal(res.statusCode, 200)
  })
  t.test(
    'sends graphql and slack bot requests with valid payloads:',
    async t => {
      const graphQlStub = sinon.stub()
      const slackStub = sinon.stub()
      const buildApp = async graphQl =>
        await build(t, {
          graphqlClient: async function authenticateGraphql() {
            return graphQl()
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
        const app = await buildApp(() => {
          graphQlStub()
          return itemCreated
        })
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemCreated,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(graphQlStub.callCount, 1)
        t.equal(slackStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })
      t.test('item updated', async t => {
        const signature = createSignature(
          itemMovedNoStatusToTodo,
          config.ORG_WEBHOOK_SECRET
        )
        const app = await buildApp(() => {
          graphQlStub()
          return itemMovedNoStatusToTodo
        })
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemMovedNoStatusToTodo,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(graphQlStub.callCount, 1)
        t.equal(graphQlStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })
      t.test('item deleted', async t => {
        const signature = createSignature(
          itemDeleted,
          config.ORG_WEBHOOK_SECRET
        )
        const app = await buildApp(() => {
          graphQlStub()
          return itemDeleted
        })
        const res = await app.inject({
          url: '/webhook',
          method: 'POST',
          body: itemDeleted,
          headers: {
            'X-Hub-Signature-256': signature,
          },
        })
        t.equal(graphQlStub.callCount, 1)
        t.equal(graphQlStub.callCount, 1)
        t.equal(res.statusCode, 200)
      })
    }
  )
})
