const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const authConfig = require('../config/auth')

const router = express.Router()

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  })
}

router.post('/register', async (req, res) => {
  const { email } = req.body

  try {
    if (await User.findOne({ email })) {
      return res.send({ error: 'Email em uso' })
    }

    const user = await User.create(req.body)

    return res.send({
      user,
      token: generateToken({ id: user.id })
    })
  } catch (err) {
    return res.send({ error: 'Registro falhou' })
  }
})

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')

  if (!user) { return res.send({ error: 'Usuário não encontrado' }) }

  if (!await bcrypt.compare(password, user.password)) {
    return res.send({ error: 'Senha invalida' })
  }

  user.password = undefined

  res.send({
    user,
    token: generateToken({ id: user.id })
  })
})

module.exports = app => app.use('/auth', router)
