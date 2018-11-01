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

const handleRootRequest = async (request) => {
  const query = await parse(request)

  if (!query.text) {
    return createError(
      'pls meme correctly (add for add, only memename for meme)',
    )
  }

  const replyAsyncily = payload => asyncResponse(query, payload)

  if (query.text.startsWith('add')) {
    return replyAsyncily(await meme.add(query.text))
  } else if (query.text.startsWith('list')) {
    return replyAsyncily(await meme.list())
  } else if (query.text.startsWith('top')) {
    return replyAsyncily(await meme.top())
  } else if (query.text.startsWith('help')) {
    return getHelp()
  } else {
    return replyAsyncily(await meme.get(query.text))
  }
}

module.exports = handleRootRequest

if (process.env.DEBUG) {
  ;(async () => {
    console.log(
      'correct',
      await module.exports({
        url: 'blabla?text=list',
      }),
    )
  })()
}
