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

const asyncResponse = async (request, payload) => {
  console.info('Responding through response_url')
  fetch(request.response_url, {
    method: 'POST',
    contentType: 'application/json',
    body: JSON.stringify(payload),
  })
    .then(r => {
      console.info(`Response: ${r.status} ${r.statusText}`)
    })
    .catch(e => {
      console.error(e)
    })

  return null
}

module.exports = {
  createImageResponse,
  createError,
  createFeedback,
  asyncResponse,
}
