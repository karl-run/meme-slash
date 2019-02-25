const { json } = require('micro')
const parse = require('urlencoded-body-parser')

require('./config/logging')
require('./config/dev')

const meme = require('./meme')
const { createError, createFeedback, asyncResponse } = require('./slack')

HELP_TEXT = `
\`\`\`
  oof ouch owie here is some help:

  show meme: /meme name
  list memes: /meme list
  top list: /meme top
  add new meme: /meme add name URL
  add new meme with multiple url /meme add name URL URL URL
\`\`\`
`

const getHelp = async () => {
  const feedback = createFeedback(HELP_TEXT)

  return feedback
}

const respond = (query, response) => {
  if (response.async) {
    log.info('RESPOND: Async query...')
    return asyncResponse(query, response.payload())
  } else {
    log.info('RESPOND: Synchronous query')
    return response.payload()
  }
}

const handleMockResponseRequest = async request => {
  const payload = await json(request)
  log.info('Received /mock callback\n' + JSON.stringify(payload, null, '  '))

  return { message: 'OK' }
}

const handleRootRequest = async request => {
  if (process.env.NODE_ENV !== 'production') {
    if (request.url === '/mock') {
      let val;
      for (let index = 0; index < 10000000000; index++) {
        val = Math.log(index)
      }
      return handleMockResponseRequest(request)
    }
  }

  const query = await parse(request)

  log.info(`MAIN: Received query: "${query.text}"`)

  if (!query.text) {
    log.info('MAIN: Empty query')
    return createError(
      'pls meme correctly (add for add, only memename for meme)',
    )
  }

  const responseMap = {
    add: {
      payload: () => meme.add(query.text),
      async: true,
    },
    list: {
      payload: meme.list,
      async: true,
    },
    top: {
      payload: meme.top,
      async: true,
    },
    help: {
      payload: getHelp,
      async: false,
    },
    default: {
      payload: () => meme.get(query.text),
      async: true,
    },
  }

  responseKey = Object.keys(responseMap).find(key => query.text.startsWith(key))

  if (responseKey != null) {
    log.info(`MAIN: Found response of type: "${responseKey}"`)
    return respond(query, responseMap[responseKey])
  } else {
    log.info(`MAIN: Found default response"`)
    return respond(query, responseMap.default)
  }
}

module.exports = async (req, res) => {
  const result = await handleRootRequest(req)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  if (typeof result === 'function') {
    res.end()
    // Allow the request to slack to finish before killing the lambda
    await result()
  } else {
    // Normal synchronous request
    res.end(result && JSON.stringify(result))
  }
}
