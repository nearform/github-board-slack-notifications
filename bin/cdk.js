#!/usr/bin/env node

const cdk = require('aws-cdk-lib')
const { CdkStack } = require('../lib/cdk-stack')

const app = new cdk.App()
new CdkStack(app, 'Github-Board-Slack-Notifications', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION
  }
})
