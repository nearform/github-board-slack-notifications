import createError from 'http-errors'
import { createHmac } from 'crypto'
import config from '../src/config.js'

export async function verifyRequest(req) {
  try {
    const originalPayloadHash = req.headers['x-hub-signature-256']
    const reqBodyHash = createSignature(req.body, config.ORG_WEBHOOK_SECRET)
    if (reqBodyHash !== originalPayloadHash) {
      throw createError(401)
    }
  } catch (err) {
    throw createError(500, err)
  }
}

export function createSignature(body, signature) {
  const hash = createHmac('sha256', signature)
  hash.update(JSON.stringify(body))
  return `sha256=${hash.digest('hex')}`
}
