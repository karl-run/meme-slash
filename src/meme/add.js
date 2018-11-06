const { Meme } = require('../data')
const { createError, createFeedback } = require('../slack')

const addNewMeme = async query => {
  const split = query.split(' ').splice(1)

  if (split.length < 2) {
    log.info("ADD: Missing name and/or URL")
    return createError('pls... Provide name and URL for meme')
  }

  const name = split.shift()
  if (name.startsWith('http')) {
    log.info("ADD: Invalid URL")
    return createError('pls... Command can not be URL')
  }

  const urls = split
  if (!urls.every(url => url.startsWith('http'))) {
    log.info("ADD: Multiple URLs, one or more invalid")
    return createError('pls... Invalid URL provided for meme')
  }

  const existingMeme = await Meme.findOne({ command: name })
  if (existingMeme) {
    if (existingMeme.urls.some(url => urls.some(eUrl => url === eUrl))) {
      log.info("ADD: Existing URL on existing meme")
      return createError(`OOF! You tried adding existing URL to "${name}"`)
    }
    
    existingMeme.urls.push(...urls)

    try {
      await existingMeme.save()
    } catch (e) {
      log.error("ADD: Unable to save existing meme", e)
      return createError('oof ouch owie something went wrong updating ' + name)
    }

    log.info("ADD: Successfully existing saved meme")
    return createFeedback(`PLS!! Meme "${name}" updated! :D xD`)
  } else {
    const newMeme = new Meme({
      command: name,
      urls,
    })

    try {
      await newMeme.save()
    } catch (e) {
      log.error("ADD: Unable to save new meme", e)
      return createError('oof ouch owie something went wrong saving new meme')
    }

    log.info("ADD: Successfully new saved meme")
    return createFeedback('PLS!! Meme saved! :D xD')
  }
}

module.exports = addNewMeme
