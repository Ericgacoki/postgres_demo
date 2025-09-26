const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { Note, User } = require('../models')
const { SECRET } = require('../util/config')

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

// Token Middleware - Adds decodedToken to the request
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({ ...req.body, userId: user.id })
    res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

//* routes to append on /api/notes

router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      important: req.query.important === "true"
    }
  })
  res.json(notes)
})

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    console.log(req.note.toJSON())
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  console.log('BODY:', req.body)
  try {
    const user = await User.findOne()
    const note = await Note.create({ ...req.body, userId: user.id })
    return res.json(note)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.destroy()
  }
  res.status(204).end()
})

module.exports = router