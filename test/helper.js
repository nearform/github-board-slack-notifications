'use strict'
import path from 'path'
import * as url from 'url'

import { build as buildApplication } from 'fastify-cli/helper.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const AppPath = path.join(__dirname, '..', 'app.js')

/*
Fill in this config with all the configurations
needed for testing the application
*/

export function config() {
  return {}
}

export async function build(t) {
  const argv = [AppPath]
  const app = await buildApplication(argv, config())

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}
export default { build, config }
