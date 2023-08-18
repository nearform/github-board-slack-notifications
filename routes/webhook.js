'use strict'
import { GraphqlResponseError } from '@octokit/graphql'
import S from 'fluent-json-schema'
import { verifyRequest } from '../lib/verify-request.js'
import { sendNotification } from '../src/slackbot.js'

const schema = {
  body: S.object()
    .prop('action', S.string().required())
    .prop(
      'projects_v2_item',
      S.object()
        .required()
        .prop('id', S.number().required())
        .prop('node_id', S.string().required())
        .prop('project_node_id', S.string().required())
        .prop('content_node_id', S.string().required())
        .prop('content_type', S.string().required())
        .prop(
          'creator',
          S.object()
            .required()
            .prop('login', S.string().required())
            .prop('html_url', S.string().required()),
        )
        .prop('created_at', S.string().required())
        .prop('updated_at', S.string().required()),
    )
    .prop('changes', S.object())
    .prop('organization', S.object())
    .prop('sender', S.object())
    .prop(
      'installation',
      S.object().required().prop('id', S.integer().required()),
    ),
}

/**
 * @type {import("fastify").FastifyPluginAsync}
 */

export default async function (fastify) {
  fastify.post(
    '/webhook',
    { schema, preHandler: verifyRequest },
    async request => {
      try {
        const app = await request.slackApp()
        await sendNotification({ app, request })
      } catch (error) {
        if (error instanceof GraphqlResponseError) {
          // A GraphqlResponseError is thrown when a project doesn't have the SlackChannel custom field added
          // This situation should be ignored
          fastify.log.info(`GraphQL error: ${error.message}`)
        } else {
          throw error
        }
      }
      return { ok: true }
    },
  )
}
