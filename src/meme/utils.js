const longestName = (memes, padding = 4) =>
  Math.max(...memes.map(m => m.name.length)) + padding

module.exports = {
  longestName,
}
