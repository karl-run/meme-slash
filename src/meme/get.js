const { Meme } = require('../data')
const { createError, createImageResponse } = require('../slack')

const getMeme = async query => {
  const split = query.split(' ')

  if (split.length !== 1) {
    return createError('Oopsie woopsie!! Only one meme param pls!!!')
  }

  const name = split[0]
  const meme = await Meme.findOne({ command: name })

  if (meme != null) {
    if (meme.urls.length === 0) {
      return createError('Oof ouch owie!!! No URLs created for meme ' + name)
    }

    const mem = meme.urls[Math.round(Math.random() * (meme.urls.length - 1))]

    if (!meme.invokes) {
      meme.invokes = 1
    } else {
      meme.invokes = meme.invokes + 1
    }

    log.info('GET: Saving meme')
    meme.save()

    return createImageResponse(mem)
  }

  return createError('no meme found with name ' + query)
}

module.exports = getMeme
