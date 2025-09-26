const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!user) {
    return response.status(401).json({
      error: `Invalid username @${body.username}`
    })
  }

  if (!(passwordCorrect)) {
    return response.status(401).json({
      error: `Incorrect password for @${body.username}`
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router