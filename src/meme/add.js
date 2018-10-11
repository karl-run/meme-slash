const { Meme } = require('../data');
const { createError, createFeedback } = require('../slack')

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

module.exports = addNewMeme
