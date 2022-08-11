'use strict'
import buildServer from '../src/app.js'
import config from '../src/config.js'

export async function build(t, additionalOptions) {
  const app = buildServer({
    ...config,
    ...additionalOptions,
    LOG_LEVEL: 'error',
  })
  // tear down our app after we are done
  t.teardown(() => app.close())

  return app
}
export default { build }
