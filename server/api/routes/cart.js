const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// POST /api/cart/tutorial/:id
// Add a tutorial to the cart
// Private
router.post('/tutorial/:id', [auth], require('../controllers/cart/addTutorial'))

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

// GET /api/cart/tutorial/:id
// Get all products from the cart
// Private
router.get('/', [auth], require('../controllers/cart/getAllProducts'))

// POST /api/cart/refreshCart
// Refresh cart, clearing conflicted and archived tutorials
// Private
router.post('/refresh_cart', [auth], require('../controllers/cart/refreshCart'))

module.exports = router
