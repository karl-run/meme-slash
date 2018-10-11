const { Meme } = require('../data')
const { createFeedback } = require('../slack')

const longestName = (lengths, padding = 4) =>
  Math.max.apply(Math, lengths) + padding

const getMemes = async () => {
  const allMemes = await Meme.find({})
  const counted = allMemes.map(meme => ({
    name: meme.command,
    count: meme.urls.length,
  }))
  const lengths = counted.map(m => m.name.length)
  const longest = longestName(lengths)

  const response = counted
    .map(m => `${m.name + ' '.repeat(longest - m.name.length)} ${m.count}x`)
    .join(`\n`)

  return createFeedback(
    `\`\`\`woawie here are the memes:\n&&\`\`\``.replace('&&', response),
  )
}

module.exports = getMemes
