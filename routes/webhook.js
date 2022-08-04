'use strict'
import S from 'fluent-json-schema'
import { verifyRequest } from '../lib/verify-request.js'
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
      const activityType = getActivityTypeFromWebhook(request.body)
      console.log(request.body)

      const id = request.body.projects_v2_item.node_id
      const installationId = request.body.installation.id
      switch (activityType) {
        case activityTypes.ISSUE_CREATED:
          fastify.log.info({
            activityType: activityTypes.ISSUE_CREATED,
            graphqlResponse: await getProjectItemById({ id, installationId }),
          })
          break
        case activityTypes.ISSUE_MOVED:
          fastify.log.info({
            activityType: activityTypes.ISSUE_MOVED,
            graphqlResponse: await getProjectItemById({ id, installationId }),
          })
          break
        case activityTypes.ISSUE_ASSIGNEES:
          fastify.log.info({
            activityType: activityTypes.ISSUE_ASSIGNEES,
            graphqlResponse: await getProjectItemById({ id, installationId }),
          })
          break
        default:
          fastify.log.info('Unhandled activity', request.body)
          break
      }
      return { ok: true }
    }
  )
}

const activityTypes = Object.freeze({
  ISSUE_MOVED: 'ISSUE_MOVED',
  ISSUE_CREATED: 'ISSUE_CREATED',
  ISSUE_ASSIGNEES: 'ISSUE_ASSIGNEES',
})

function getActivityTypeFromWebhook(webhookPayload) {
  const {
    action,
    projects_v2_item: { content_type },
    changes,
  } = webhookPayload

  if (content_type !== 'Issue') {
    return null
  }

  if (action === 'created') {
    return activityTypes.ISSUE_CREATED
  }

  if (action === 'edited') {
    // This refers to the status field of an item changing e.g. TODO -> In Progress
    if (changes.field_value?.field_type === 'single_select') {
      return activityTypes.ISSUE_MOVED
    }

    if (changes.field_value?.field_type === 'assignees') {
      return activityTypes.ISSUE_ASSIGNEES
    }
  }

  return null
}
