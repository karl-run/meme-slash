const parse = require('urlencoded-body-parser')

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
    console.info('RESPOND: Async query...')
    return asyncResponse(query, response.payload())
  } else {
    console.info('RESPOND: Synchronous query')
    return response.payload()
  }
}

const handleRootRequest = async request => {
  const query = await parse(request)

  console.info(`MAIN: Received query: "${query.text}"`)

  if (!query.text) {
    console.info('MAIN: Empty query')
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

  responseKey = Object.keys(responseMap).find(key => key.startsWith(query.text))

  if (responseKey != null) {
    console.info(`MAIN: Found response of type: "${responseKey}"`)
    return respond(query, responseMap[responseKey])
  } else {
    console.info(`MAIN: Found default response"`)
    return respond(query, responseMap.default)
  }
}

module.exports = handleRootRequest
