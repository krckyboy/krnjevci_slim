const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const {
	createTutorialValidation,
	createTutorialBundleValidation,
} = require('../validation/index')

// POST /api/tutorials
// Create a tutorial
// Private + admin privilege
router.post(
	'/',
	[auth, adminAuth, createTutorialValidation],
	require('../controllers/tutorials/addTutorial')
)

// GET /api/tutorials/bundle/search
// Search tutorial bundles by name
// Public
router.get(
	'/bundle/search',
	require('../controllers/tutorials/searchBundlesByName')
)

// GET /api/tutorials/search
// Search tutorials by name
// Public
router.get('/search', require('../controllers/tutorials/searchTutorialsByName'))

// POST /api/tutorials/bundle
// Create a tutorial bundle
// Private + admin privilege
router.post(
	'/bundle',
	[auth, adminAuth, createTutorialBundleValidation],
	require('../controllers/tutorials/createTutorialBundle')
)

// GET /api/tutorials/bundle
// Fetch bundles (thumbnails, IDs from DB, etc, but not actual video links)
// Public
router.get(
	'/bundle',
	require('../controllers/tutorials/fetchBundlesPagination')
)

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

// GET /api/tutorials/bundle/:id
// Fetch a bundle by ID
// Private
router.get(
	'/bundle/:id',
	[auth],
	require('../controllers/tutorials/fetchBundleById')
)

// GET /api/tutorials/
// Fetch tutorials (thumbnails, IDs from DB, etc, but not actual video links)
// Public
router.get('/', require('../controllers/tutorials/fetchTutorialsPagination'))

// DELETE /api/tutorials/bundle/:id
// Delete a bundle by ID
// Private + admin privilege
router.delete(
	'/bundle/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/deleteBundle')
)

// DELETE /api/tutorials/:id
// Delete a tutorial by ID
// Private + admin privilege
router.delete(
	'/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/deleteTutorial')
)

// POST /api/tutorials/archive/bundle/:id
// Archive a bundle by ID
// Private + admin privilege
router.post(
	'/archive/bundle/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/archiveBundle')
)

// POST /api/tutorials/archive/:id
// Archive a tutorial by ID
// Private + admin privilege
router.post(
	'/archive/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/archiveTutorial')
)

// POST /api/tutorials/fetchBundlesOfTutorial/:id
// Archive a tutorial by ID
// Private + admin privilege
router.post(
	'/fetchBundlesOfTutorial/:id',
	[auth, adminAuth],
	require('../controllers/tutorials/fetchBundlesOfTutorial')
)

module.exports = router
