if (process.env.NODE_ENV !== 'production') {
  require('now-env')
}

const mongoose = require('mongoose')

const t1 = new Date()
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
  },
  () => {
    console.info(`MONGO: Connecting to Mongo took ${new Date() - t1}ms`)
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
