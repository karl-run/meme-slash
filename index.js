const url = require('url')
const memes = require('./memes')

module.exports = async (request, res) => {
  const query = url.parse(request.url, true).query

  if (!query.text) {
    return createError('pls supply meme name')
  }

  const meme = memes[query.text]
  if (meme != null) {
    let mem = meme
    if (Array.isArray(meme)) {
      mem = meme[Math.round(Math.random() * meme.length - 1)]
    }

    return createImageResponse(mem)
  }

  return createError('no meme found with name ' + query.text)
}

const createImageResponse = imageUrl => ({
  response_type: 'in_channel',
  attachments: [
    {
      image_url: imageUrl,
    },
  ],
})

const createError = message => ({
  response_type: 'ephemeral',
  text: message,
})
