var mongoose = require('mongoose')

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true },
)

const MemeSchema = new mongoose.Schema({
  command: { type: String, index: { unique: true } },
  alias: [String],
  urls: [{ type: String, index: { unique: true } }],
  invokes: Number,
})

const Meme = mongoose.models.Meme || mongoose.model('Meme', MemeSchema)

module.exports = {
  Meme,
}
