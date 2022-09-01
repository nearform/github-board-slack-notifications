import S from 'fluent-json-schema'
import envSchema from 'env-schema'
import rcfile from 'rcfile'
import { join } from 'path'

const schema = S.object()
  .prop('SLACK_TOKEN', S.string().required())
  .prop('SLACK_SIGNING_SECRET', S.string().required())
  .prop('ORG_WEBHOOK_SECRET', S.string().required())
  .prop('ORG_PRIVATE_KEY', S.string().required())
  .prop('ORG_APP_ID', S.string().required())
  .prop('LOG_LEVEL', S.string().default('info'))
  .prop('PRETTY_PRINT', S.boolean().default(true))

const config = envSchema({
  schema,
  dotenv: true,
})

export default config

export const notificationConfig = rcfile('notification-config', {
  cwd: join(process.cwd(), 'config'),
  configFileName: 'notification-config',
})
