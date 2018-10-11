const { Meme } = require('../data')
const { createFeedback } = require('../slack')
const { longestName } = require('./utils')

const postFixes = [' uses', ' mems', ' skidaddles', 'x', 'y', ' invokations']

const getPostfix = () =>
  postFixes[Math.round(Math.random() * (postFixes.length - 1))]

const getTopList = async () => {
  const allMemes = await Meme.find({})
  const counted = allMemes
    .map(meme => ({
      name: meme.command,
      invokes: meme.invokes || 0,
    }))
    .sort((a, b) => b.invokes - a.invokes)
  const longest = longestName(counted)
  const postFix = getPostfix()
  const response = counted
    .map(
      m =>
        `${m.name + ' '.repeat(longest - m.name.length)} ${
          m.invokes
        }${postFix}`,
    )
    .join(`\n`)

  return createFeedback(
    `\`\`\`woawie here are the memes:\n&&\`\`\``.replace('&&', response),
  )
}

module.exports = getTopList
