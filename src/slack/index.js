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

module.exports = {
  createImageResponse,
  createError,
  createFeedback,
}
