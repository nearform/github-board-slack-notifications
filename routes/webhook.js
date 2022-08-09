'use strict'
import S from 'fluent-json-schema'
import { verifyRequest } from '../lib/verify-request.js'
import * as webhook from '../lib/get-webhook-activity.js'
import { getProjectItemById } from '../src/graphql.js'
import * as slackbot from '../src/slackbot.js'

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
        projects_v2_item: { node_id: id, content_node_id },
      } = request.body

      console.log({ activityType })

      let issue, creator, title, column, issueLink

      switch (activityType) {
        case webhook.ISSUE_DELETED:
          issue = await getProjectItemById({
            graphqlClient: await request.authenticateGraphql(),
            id: content_node_id,
          })

          title = issue.node.title
          break
        case webhook.DRAFT_CREATED:
          issue = await getProjectItemById({
            graphqlClient: await request.authenticateGraphql(),
            id,
          })

          creator = request.body.projects_v2_item.creator.login

          title = issue.node.content.title
          column = issue.node.fieldValueByName.name

          await slackbot.sendDraftIssueCreated({
            creator,
            title,
            column,
          })

          break
        case webhook.ISSUE_CREATED:
          issue = await getProjectItemById({
            graphqlClient: await request.authenticateGraphql(),
            id,
          })

          creator = request.body.projects_v2_item.creator.login

          title = issue.node.content.title
          column = issue.node.fieldValueByName.name
          issueLink = issue.node.content.url

          await slackbot.sendIssueCreated({
            creator,
            title,
            column,
            issueLink,
          })

          break
        case webhook.ISSUE_MOVED:
          break
        case webhook.ISSUE_ASSIGNEES:
          break
        default:
          fastify.log.info('Unhandled activity')
          break
      }

      return { ok: true, activityType }
    }
  )
}
