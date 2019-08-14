const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv/config')

const app = express()

mongoose.connect(
  process.env.MONGOOSE_URL,
  {
    useNewUrlParser: true
  }
)

app.use(cors())
app.use(express.urlencoded())
app.use(express.json())

require('./controllers/authController')(app)

app.listen(process.env.PORT || 3333)
