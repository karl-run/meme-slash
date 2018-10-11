const { Meme } = require('../data')
const { createFeedback } = require('../slack')
const { longestName } = require('./utils')

const getTopList = async () => {
  const allMemes = await Meme.find({})
  const counted = allMemes
    .map(meme => ({
      name: meme.command,
      invokes: meme.invokes || 0,
    }))
    .sort((a, b) => b.invokes - a.invokes)
  const longest = longestName(counted)
  const response = counted
    .map(m => `${m.name + ' '.repeat(longest - m.name.length)} ${m.invokes}x`)
    .join(`\n`)

  return createFeedback(
    `\`\`\`woawie here are the memes:\n&&\`\`\``.replace('&&', response),
  )
}

module.exports = getTopList
