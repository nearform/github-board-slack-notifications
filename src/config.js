import S from 'fluent-json-schema'
import envSchema from 'env-schema'

const schema = S.object()
  .prop('SLACK_TOKEN', S.string().required())
  .prop('SLACK_SIGNING_SECRET', S.string().required())
  .prop('SLACK_CHANNEL', S.string().required())
  .prop('ORG_WEBHOOK_SECRET', S.string().required())
  .prop('ORG_ACCESS_TOKEN', S.string().required())

const config = envSchema({
  schema,
  dotenv: true,
})

export default config
