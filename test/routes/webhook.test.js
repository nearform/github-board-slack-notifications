'use strict'

import { test } from 'tap'

import { build } from '../helper.js'

test('POST /webhook', async t => {
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
  t.test('returns 200 with valid payload', async t => {
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
          creator: {},
        },
      },
    })

    t.equal(res.statusCode, 200)
  })
})
