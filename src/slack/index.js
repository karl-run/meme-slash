const fetch = require('node-fetch')

const createImageResponse = imageUrl => ({
  response_type: 'in_channel',
  attachments: [
    {
      image_url: imageUrl,
    },
  ],
})

const createError = message => ({
  response_type: 'ephemeral',
  text: message,
})

const createFeedback = message => ({
  response_type: 'ephemeral',
  text: message,
})

const asyncResponse = async (query, asyncPayload) => {
  log.info('SLACK: Responding through response_url')
  const respond = async () => {
    const payload = await asyncPayload

    fetch(query.response_url, {
      method: 'POST',
      contentType: 'application/json',
      body: JSON.stringify(payload),
    })
      .then(r => {
        log.info(`SLACK: Response: ${r.status} ${r.statusText}`)
      })
      .catch(e => {
        console.error('SLACK: Error', e)
      })
  }

  await respond()

  return null
}

module.exports = {
  createImageResponse,
  createError,
  createFeedback,
  asyncResponse,
}
