'use strict'
import S from 'fluent-json-schema'
import { GraphqlResponseError } from '@octokit/graphql'
import { verifyRequest } from '../lib/verify-request.js'
import * as webhook from '../lib/get-webhook-activity.js'
import {
  getIssueById,
  getProjectById,
  getProjectItemById,
} from '../src/graphql.js'
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
        projects_v2_item: {
          node_id: id,
          content_node_id,
          content_type,
          project_node_id,
        },
      } = request.body

      if (!Object.values(webhook).includes(activityType)) {
        fastify.log.info('Unhandled activity')
        return
      }
      try {
        let issue, project
        // for deleted items, the project items are deleted as well
        // we need to get the project by itself
        if (activityType === webhook.ISSUE_DELETED) {
          project = await getProjectById({
            graphqlClient: await request.authenticateGraphql(),
            id: project_node_id,
          })
          issue = {
            node: {
              project: project.node,
            },
          }
        } else {
          issue = await getProjectItemById({
            graphqlClient: await request.authenticateGraphql(),
            id,
          })
        }
        let {
          node: {
            creator: { url: itemAuthorUrl, login: authorUsername } = {},
            content: {
              title,
              url: itemUrl,
              number: itemNumber,
              author: { url: authorUrl, name: authorName } = {},
            } = {},
            project: {
              url: projectUrl,
              title: projectName,
              field: { options: slackChannels },
            },
            fieldValueByName: { name: column = null } = {},
          },
        } = issue
        const channels = slackChannels.map(({ name }) => name)

        switch (activityType) {
          case webhook.ISSUE_DELETED:
            // When an issue is deleted, the content node of the ProjectV2Item is empty,
            // thus we have to fetch by content_node_id to get the title and number
            // eslint-disable-next-line prettier/prettier
            ({
              node: { title, number: itemNumber },
            } = await getIssueById({
              graphqlClient: await request.authenticateGraphql(),
              id: content_node_id,
            }))
            await slackbot.sendIssueDeleted(await request.slackApp(), {
              title,
              channels,
              issueNumber: itemNumber,
              projectName,
              projectUrl,
              isDraft: content_type === webhook.CONTENT_TYPE_DRAFT_ISSUE,
            })
            break
          case webhook.DRAFT_CREATED:
            await slackbot.sendDraftIssueCreated(await request.slackApp(), {
              authorUrl: authorUrl || itemAuthorUrl,
              authorName: authorName || authorUsername,
              title,
              channels,
              issueNumber: itemNumber,
              projectName,
              projectUrl,
            })

            break
          case webhook.ISSUE_CREATED:
            await slackbot.sendIssueCreated(await request.slackApp(), {
              authorUrl: authorUrl || itemAuthorUrl,
              authorName: authorName || authorUsername,
              title,
              issueUrl: itemUrl,
              channels,
              issueNumber: itemNumber,
              projectName,
              projectUrl,
            })
            break
          case webhook.ISSUE_MOVED:
            await slackbot.sendIssueUpdated(await request.slackApp(), {
              title,
              column,
              issueUrl: itemUrl,
              issueNumber: itemNumber,
              projectUrl,
              channels,
              isDraft: content_type === webhook.CONTENT_TYPE_DRAFT_ISSUE,
            })
            break
          case webhook.ISSUE_ASSIGNEES:
            break
          case webhook.PR_CREATED:
            await slackbot.sendPullRequestCreated(await request.slackApp(), {
              authorUrl: authorUrl || itemAuthorUrl,
              authorName: authorName || authorUsername,
              title,
              prUrl: itemUrl,
              channels,
              prNumber: itemNumber,
              projectName,
              projectUrl,
            })
            break
          case webhook.PR_DELETED:
            // eslint-disable-next-line prettier/prettier
            ({
              node: { title, number: itemNumber },
            } = await getIssueById({
              graphqlClient: await request.authenticateGraphql(),
              id: content_node_id,
            }))
            await slackbot.sendPullRequestDeleted(await request.slackApp(), {
              title,
              channels,
              prNumber: itemNumber,
              projectName,
              projectUrl,
            })
            break
          default:
            fastify.log.info('Unhandled activity')
            break
        }
      } catch (e) {
        if (e instanceof GraphqlResponseError) {
          // A GraphqlResponseError is thrown when a project doesn't have the SlackChannel custom field added
          // This situation should be ignored
          fastify.log.info(`GraphQL error: ${e.message}`)
        } else {
          throw e
        }
      }

      return { ok: true, activityType }
    }
  )
}
