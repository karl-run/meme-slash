const mongoose = require('mongoose')

const t1 = new Date()
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  error => {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    log.info(`MONGO: Connecting to Mongo took ${new Date() - t1}ms`)
  },
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
