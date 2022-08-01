'use strict'

const path = require('path')
const { build: buildApplication } = require('fastify-cli/helper')

const AppPath = path.join(__dirname, '..', 'app.js')

/*
Fill in this config with all the configurations
needed for testing the application
*/
function config() {
  return {}
}

async function build(t) {
  const argv = [AppPath]
  const app = await buildApplication(argv, config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}

module.exports = { config, build }
