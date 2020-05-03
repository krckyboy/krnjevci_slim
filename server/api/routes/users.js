const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { loginUserValidation } = require('../validation/index')
const { registerUserValidation } = require('../validation/index')

// POST /api/users
// Register a new user and return token
// Public
router.post(
	'/',
	registerUserValidation,
	require('../controllers/users/register')
)

// POST /api/users/login
// Login and return token
// Public
router.post(
	'/login',
	loginUserValidation,
	require('../controllers/users/login')
)

// @route 	GET api/users/current_user
// @desc 	Get logged in user data
// @access 	Private
router.get(
	'/current_user',
	auth,
	require('../controllers/users/fetchCurrentUser')
)

/*
// Delete /api/users
// Delete logged user
// Private
router.delete('/', auth, require('../controllers/users/deleteCurrentUser'))
*/

module.exports = router
