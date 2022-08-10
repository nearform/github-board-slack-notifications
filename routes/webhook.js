'use strict'
import S from 'fluent-json-schema'
import { GraphqlResponseError } from '@octokit/graphql'
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
 * @type {import("fastify").FastifyPluginAsync}
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

      if (!Object.values(webhook).includes(activityType)) {
        fastify.log.info('Unhandled activity')
        return
      }

      const issue = await getProjectItemById({
        graphqlClient: await request.authenticateGraphql(),
        id,
      })
      const {
        node: {
          creator: { url: authorUrl, login: authorUsername },
          content: { title, url: issueUrl, number: issueNumber },
          project: {
            url: projectUrl,
            field: { options: slackChannels },
          },
          fieldValueByName: { name: column } = {},
        },
      } = issue
      fastify.log.info(issue)
      const channels = slackChannels.map(({ name }) => name)

      try {
        switch (activityType) {
          case webhook.ISSUE_DELETED:
            break
          case webhook.DRAFT_CREATED:
            await slackbot.sendDraftIssueCreated({
              authorUrl,
              authorUsername,
              title,
              column,
              channels,
            })

            break
          case webhook.ISSUE_CREATED:
            await slackbot.sendIssueCreated({
              authorUrl,
              authorUsername,
              title,
              column,
              issueUrl,
              channels,
            })
            break
          case webhook.ISSUE_MOVED:
            await slackbot.sendIssueUpdated({
              title,
              column,
              issueUrl,
              issueNumber,
              projectUrl,
              channels,
            })
            break
          case webhook.ISSUE_ASSIGNEES:
            break
          default:
            fastify.log.info('Unhandled activity')
            break
        }
      } catch (e) {
        if (e instanceof GraphqlResponseError) {
          fastify.log.info('GraphQL error:', e.message)
        } else {
          throw e
        }
      }

      return { ok: true, activityType }
    }
  )
}
