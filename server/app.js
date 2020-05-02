require('dotenv').config()
const express = require('express')
const app = express()
require('./db/index')

// Init Middleware (bodyparser)
app.use(express.json({ extended: false }))

app.get('/', (req, res) => {
	res.json({ success: true })
})

// Routers
app.use('/api/users', require('./api/routes/users'))
app.use('/api/tutorials', require('./api/routes/tutorials'))
app.use('/api', require('./api/routes/general'))
app.use('/api/cart', require('./api/routes/cart'))
// app.use('/api/skills', require('./api/routes/skills'))
// app.use('/api/tags', require('./api/routes/tags'))

module.exports = app
