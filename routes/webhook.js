'use strict'
import S from 'fluent-json-schema'
import { verifyRequest } from '../lib/verify-request.js'

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
        .prop('creator', S.object().required())
        .prop('created_at', S.string().required())
        .prop('updated_at', S.string().required())
    )
    .prop('changes', S.object())
    .prop('organization', S.object())
    .prop('sender', S.object()),
}

/**
 * @type {import('fastify').FastifyPluginAsync}
 */
export default async function (fastify) {
  fastify.post(
    '/webhook',
    { schema, preHandler: verifyRequest },
    async (/*request, reply*/) => {
      return { ok: true }
    }
  )
}
