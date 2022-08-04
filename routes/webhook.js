'use strict'
import S from 'fluent-json-schema'
import { verifyRequest } from '../lib/verify-request.js'
import * as webhook from '../lib/get-webhook-activity.js'
import { getProjectItemById } from '../src/graphql.js'

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
            .prop('html_url', S.string().required())
        )
        .prop('created_at', S.string().required())
        .prop('updated_at', S.string().required())
    )
    .prop('changes', S.object())
    .prop('organization', S.object())
    .prop('sender', S.object())
    .prop(
      'installation',
      S.object().required().prop('id', S.integer().required())
    ),
}

/**
 * @type {import('fastify').FastifyPluginAsync}
 */

export default async function (fastify) {
  fastify.post(
    '/webhook',
    { schema, preHandler: verifyRequest },
    async request => {
      const activityType = webhook.getActivity(request.body)

      const {
        projects_v2_item: { node_id: id },
      } = request.body

      switch (activityType) {
        case webhook.ISSUE_CREATED:
        case webhook.ISSUE_MOVED:
        case webhook.ISSUE_ASSIGNEES:
          fastify.log.info(
            await getProjectItemById({
              graphqlClient: await fastify.authenticateGraphql(request),
              id,
            }),
            activityType
          )
          break
        default:
          fastify.log.info(request.body, 'Unhandled activity')
          break
      }
      return { ok: true, activityType }
    }
  )
}
