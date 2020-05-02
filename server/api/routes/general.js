const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// POST /api/charge
// Process charging via stripe
// Private
router.post('/charge', [auth], require('../controllers/charge'))

module.exports = router

// stripe @stripe/stripe-js @stripe/react-stripe-js axios
// be     fe                fe                      fe