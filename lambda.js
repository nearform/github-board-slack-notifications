import awsLambdaFastify from '@fastify/aws-lambda'
import init from './src/app.js'
const app = init()
export const handler = awsLambdaFastify(app)
