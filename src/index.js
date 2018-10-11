const url = require('url')

const meme = require('./meme')
const { createError, createFeedback } = require('./slack')

HELP_TEXT = `
\`\`\`
  oof ouch owie here is some help:

  show meme: /meme name
  list memes: /meme list
  add new meme: /meme add name URL
  add new meme with multiple url /meme add name URL URL URL
\`\`\`
`

const getHelp = async () => {
  const feedback = createFeedback(HELP_TEXT)

  return feedback
}

const handleRootRequest = async (request, res) => {
  const query = url.parse(request.url, true).query

  if (!query.text) {
    return createError(
      'pls meme correctly (add for add, only memename for meme)',
    )
  }

  if (query.text.startsWith('add')) {
    return meme.add(query.text)
  } else if (query.text.startsWith('list')) {
    return meme.list()
  } else if (query.text.startsWith('help')) {
    return getHelp()
  } else {
    return meme.get(query.text)
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
