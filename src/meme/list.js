const { Meme } = require('../data')
const { createFeedback } = require('../slack')
const { longestName } = require('./utils')

const getMemes = async () => {
  const allMemes = await Meme.find({})
  const counted = allMemes.map(meme => ({
    name: meme.command,
    count: meme.urls.length,
  }))
  const longest = longestName(counted)
  const response = counted
    .map(m => `${m.name + ' '.repeat(longest - m.name.length)} ${m.count}x`)
    .join(`\n`)

  return createFeedback(
    `\`\`\`woawie here are the memes:\n&&\`\`\``.replace('&&', response),
  )
}

module.exports = getMemes
