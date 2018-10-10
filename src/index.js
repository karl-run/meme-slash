const url = require('url')

const { createImageResponse, createError, createFeedback } = require('./slack')
const { Meme } = require('./database')

const addNewMeme = async query => {
  const split = query.split(' ').splice(1)

  if (split.length < 2) {
    return createError('pls... Provide name and URL for meme')
  }

  const name = split.shift()
  if (name.startsWith('http')) {
    return createError('pls... Command can not be URL')
  }

  const urls = split
  if (!urls.every(url => url.startsWith('http'))) {
    return createError('pls... Invalid URL provided for meme')
  }

  const existingMeme = await Meme.findOne({ command: name })
  if (existingMeme) {
    if (existingMeme.urls.some(url => urls.some(eUrl => url === eUrl))) {
      return createError('OOF! You tried adding existing URL to ' + name)
    }

    existingMeme.urls.push(...urls)

    try {
      await existingMeme.save()
    } catch (e) {
      return createError('oof ouch owie something went wrong updating ' + name)
    }

    return createFeedback(`PLS!! Meme "${name}" updated! :D xD`)
  } else {
    const newMeme = new Meme({
      command: name,
      urls,
    })

    try {
      await newMeme.save()
    } catch (e) {
      return createError('oof ouch owie something went wrong saving new meme')
    }

    return createFeedback('PLS!! Meme saved! :D xD')
  }
}

const getMeme = async query => {
  const split = query.split(' ')

  if (split.length !== 1) {
    return createError('Oopsie woopsie!! Only one meme param pls!!!')
  }

  const name = split[0]
  const meme = await Meme.findOne({ command: name })
  if (meme != null) {
    console.log(meme)
    if (meme.urls.length === 0) {
      return createError('Oof ouch owie!!! No URLs created for meme ' + name)
    }

    const mem = meme.urls[Math.round(Math.random() * (meme.urls.length - 1))]

    return createImageResponse(mem);
  }

  return createError('no meme found with name ' + query)
}

const handleRootRequest = async (request, res) => {
  const query = url.parse(request.url, true).query

  if (!query.text) {
    return createError(
      'pls meme correctly (add for add, only memename for meme)',
    )
  }

  if (query.text.startsWith('add')) {
    return addNewMeme(query.text)
  } else {
    return getMeme(query.text)
  }
}

module.exports = handleRootRequest

if (process.env.DEBUG) {
  ;(async () => {
    console.log(
      'correct',
      await module.exports({
        url: 'blabla?text=add%20carf%20http://coffy.com',
      }),
    )
    console.log(
      'multi url',
      await module.exports({
        url: 'blabla?text=add%20coffy%20http://coffy.com%20http://carfy.com',
      }),
    )
    console.log(
      'correct',
      await module.exports({
        url: 'blabla?text=carf',
      }),
    )
  })()
}
