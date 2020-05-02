const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// POST /api/cart/tutorial/:id
// Add a tutorial to the cart
// Private
router.post('/tutorial/:id', [auth], require('../controllers/cart/addTutorial'))

// POST /api/cart/bundle/:id
// Add a bundle to the cart
// Private
router.post('/bundle/:id', [auth], require('../controllers/cart/addBundle'))

// DELETE /api/cart/tutorial/:id
// Clear cart
// Private
router.delete('/', [auth], require('../controllers/cart/clearCart'))

// DELETE /api/cart/tutorial/:id
// Remove a tutorial from the cart
// Private
router.delete(
	'/tutorial/:id',
	[auth],
	require('../controllers/cart/removeTutorial')
)

// DELETE /api/cart/bundle/:id
// Remove a bundle from the cart
// Private
router.delete(
	'/bundle/:id',
	[auth],
	require('../controllers/cart/removeBundle')
)

// GET /api/cart/tutorial/:id
// Get all products from the cart
// Private
router.get('/', [auth], require('../controllers/cart/getAllProducts'))

// POST /api/cart/refreshCart
// Refresh cart, clearing conflicted and archived tutorials
// Private
router.post('/refreshCart', [auth], require('../controllers/cart/refreshCart'))

module.exports = router
