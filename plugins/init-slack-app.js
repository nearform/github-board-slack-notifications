'use strict'
import slackBolt from '@slack/bolt'
const { App } = slackBolt
import config from '../src/config.js'
import fp from 'fastify-plugin'

export const initSlackApp = () =>
  new App({
    token: config.SLACK_TOKEN,
    signingSecret: config.SLACK_SIGNING_SECRET,
  })

export default fp(async function (fastify, options) {
  const { slackApp = initSlackApp } = options

  fastify.decorateRequest('slackApp', function () {
    return slackApp()
  })
})
