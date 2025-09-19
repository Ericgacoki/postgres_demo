const router = require('express').Router()
const { Note } = require('../models')

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

//* routes to append on /api/notes

router.get('/', async (req, res) => {
  const notes = await Note.findAll()
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
    const note = await Note.create(req.body)
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

router.delete('/:id',noteFinder, async (req, res) => {
  if (req.note) {
    req.note.destroy()
  }
  res.status(204).end()
})

module.exports = router