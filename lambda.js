import awsLambdaFastify from '@fastify/aws-lambda'
import init from './src/app.js'
const app = init()
const main = async () => {
  const handler = awsLambdaFastify(app)
  await app.ready()
  return handler
}
export const handler = main()
