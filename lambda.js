import awsLambdaFastify from '@fastify/aws-lambda'
import init from './src/app.js'
export const handler = awsLambdaFastify(init())
