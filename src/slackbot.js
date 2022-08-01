import pkg from '@slack/bolt'
import config from './config.js'
const { App } = pkg

// Initializes your app with your bot token and signing secret
const app = new App({
  token: config.SLACK_BOT_TOKEN,
  signingSecret: config.SLACK_SIGNING_SECRET,
})

;(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000)

  try {
    const result = await app.client.chat.postMessage({
      channel: config.CHANNEL_ID,
      text: 'Hello world! 👋',
    })

    console.log('****', { result })
  } catch (error) {
    console.error('****', { error })
  }

  console.log('⚡️ Bolt app is running!')
})()
