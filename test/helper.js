'use strict'
import buildServer from '../src/app.js'
import config from '../src/config.js'
import { markdownEscapes } from '../src/messages.js'

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

/**
 * checks if a string contains undescaped markdown characters
 * it removes from a string known escaped patters and then checks if there any unescaped characters left
 * @param {string} text
 * @returns {boolean}
 */
export function isMarkdownEscapeValid(text) {
  return markdownEscapes.every(({ regex, replacement }) => {
    const pattern = new RegExp(`${replacement}`, 'g')
    const escaped = text.replace(pattern, '')
    return escaped.search(regex) === -1
  })
}

export function generateRandomString(strlength) {
  const allc =
    '!@#$%^&*()_+~`|}{[]:;?><,./-=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result
  for (let i = 0; i < strlength; i++) {
    result += allc[Math.floor(Math.random() * allc.length)]
  }
  return result
}

export function isMessageValid(text) {
  return text.search(/\{(.*?)\}/gm) === -1
}

export function createRandomAssignees() {
  return [
    {
      nodes: [
        {
          name: 'some-name',
        },
        {
          name: 'some-other-name',
        },
      ],
    },
    {
      nodes: [],
    },
    {},
    {
      nodes: [{}],
    },
    {
      nodes: {},
    },
    undefined,
  ]
}
