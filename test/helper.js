'use strict'
import path from 'path'
import * as url from 'url'

import { build as buildApplication } from 'fastify-cli/helper.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const AppPath = path.join(__dirname, '..', 'src', 'app.js')

/*
Pass config with all the configurations
needed for testing the application
*/

export async function build(t, config = {}) {
  const argv = [AppPath]
  const app = await buildApplication(argv, config)

  // tear down our app after we are done
  t.teardown(app.close.bind(app))

  return app
}
export default { build }
