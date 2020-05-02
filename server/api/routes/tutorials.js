const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const { createTutorialValidation } = require('../validation/index')

// POST /api/tutorials
// Create a tutorial
// Private + admin privilege
router.post(
	'/',
	[auth, adminAuth, createTutorialValidation],
	require('../controllers/tutorials/addTutorial')
)

// GET /api/tutorials/search
// Search tutorials by name
// Public
router.get('/search', require('../controllers/tutorials/searchTutorialsByName'))

// GET /api/tutorials/bought
// Fetch bought tutorials
// Private
router.get(
	'/bought',
	[auth],
	require('../controllers/tutorials/fetchBoughtTutorials')
)

// GET /api/tutorials/:id
// Fetch a tutorial by ID
// Private
router.get(
	'/:id',
	[auth],
	require('../controllers/tutorials/fetchTutorialById')
)

// GET /api/tutorials/
// Fetch tutorials (thumbnails, IDs from DB, etc, but not actual video links)
// Public
router.get('/', require('../controllers/tutorials/fetchTutorialsPagination'))

// DELETE /api/tutorials/:id
// Delete a tutorial by ID
// Private + admin privilege
router.delete(
	'/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/deleteTutorial')
)

// POST /api/tutorials/archive/:id
// Archive a tutorial by ID
// Private + admin privilege
router.post(
	'/archive/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/archiveTutorial')
)

module.exports = router
