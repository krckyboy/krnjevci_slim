const request = require('supertest')
const app = require('../app')
const {
	registerNewUser,
	login,
	userOne,
	userTwo,
	adminUser,
	createAdminAccount,
	tutorial1,
	createTutorial,
	compareValues,
	tutorial2,
	tutorial3,
	tutorial4,
	tutorial5,
	fetchTutorialById,
	deleteTutorial,
	archiveTutorial,
	fetchTutorialsPagination,
	createBundle,
	bundle1,
	bundle2,
	fetchBundleById,
	fetchBundlesPagination,
	archiveBundle,
	bundle3,
	bundle4,
	bundle5,
	deleteBundle,
	searchTutorials,
	searchBundles,
	charge,
	addTutorialToCart,
	removeTutorialFromCart,
	removeBundleFromCart,
	getAllProductsFromCart,
	clearCart,
	addBundleToCart,
	fetchBoughtTutorials,
} = require('./utils')

const User = require('../db/models/User')
const Tutorial = require('../db/models/Tutorial')
const TutorialBundle = require('../db/models/TutorialBundle')
const Cart = require('../db/models/Cart')
const Purchase = require('../db/models/Purchase')

beforeEach(async () => {
	await User.query().delete()
	await Tutorial.query().delete()
	await TutorialBundle.query().delete()
	await Cart.query().delete()
	await Purchase.query().delete()
	await registerNewUser({ user: userOne, status: 201 })
})

afterAll(async () => {
	await User.query().delete()
	await Tutorial.query().delete()
	await TutorialBundle.query().delete()
	await Cart.query().delete()
	await Purchase.query().delete()
})
/*
// @todo Check if validation works correctly
test('Registration [201, 400]', async () => {
	const newUser = {
		email: 'dusan@gmail.com',
		password: 'password',
	}

	await registerNewUser({
		user: newUser,
		status: 201,
	})

	const fetchedUser = await User.query().findOne({
		email: newUser.email,
	})

	expect(fetchedUser.email).toBe(newUser.email)
	expect(fetchedUser.password).not.toBe(newUser.password)

	await registerNewUser({ user: userOne, status: 400 })
})

// @todo Check if validation works correctly
test('Login [200, 2x 400], fetch current user', async () => {
	// User one logins
	const responseLoginSuccess = await login({ user: userOne })

	// eslint-disable-next-line require-atomic-updates
	userOne.token = responseLoginSuccess

	// Check if the new token works by hitting a private route
	const responseLoggedUserData = await request(app)
		.get('/api/users/current_user')
		.set('Authorization', `Bearer ${userOne.token}`)
		.send(userOne)
		.expect(200)

	const loggedUserData = responseLoggedUserData.body.user
	expect(loggedUserData.email).toBe(userOne.email)

	// When user doesn't exist return 400
	const responseLoginFail = await login({
		user: {
			email: 'nonexistentemail@gmail.com',
			password: userOne.password,
		},
		status: 400,
	})
	expect(responseLoginFail.msg).toBe('Invalid credentials!')

	// When password doesn't match, return 400
	const responseLoginFail2 = await login({
		user: { email: userOne.email, password: 'invalidPassword' },
		status: 400,
	})
	expect(responseLoginFail2.msg).toBe('Invalid credentials!')
})

test('Delete user', async () => {
	// User two registers
	await registerNewUser({ user: userTwo, status: 201 })

	// Delete user ONE
	await request(app)
		.delete('/api/users')
		.set('Authorization', `Bearer ${userOne.token}`)
		.expect(200)

	// Check if only user two exists
	const users = await User.query()
	expect(users.length).toBe(1)
	expect(users[0].id).toBe(userTwo.id)
})

// Add a tutorial
test('Add a tutorial, check if admin auth works', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Check if registered user has admin privilege
	const registeredAdmin = await User.query().findOne({ id: adminUser.id })
	expect(registeredAdmin.is_admin).toBe(true)

	// Check if userOne doesn't have admin privileges
	const fetchedUserOne = await User.query().findOne({ id: userOne.id })
	expect(fetchedUserOne.is_admin).toBe(false)

	// Create a tutorial
	const createdTutorial = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	compareValues({
		obj: createdTutorial,
		values: { ...tutorial1 },
	})

	// Try to create a tutorial with userOne and fail
	const errorText = await createTutorial({
		status: 401,
		token: userOne.token,
		tutorial: { ...tutorial2 },
	})
	expect(errorText.msg).toBe('No admin privileges, access denied!')

	// Admin tries to create a tutorial with the same name, fails
	const duplicateTutorialMessage = await createTutorial({
		status: 400,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})
	expect(duplicateTutorialMessage.msg).toBe(
		'There is already a tutorial under that name!'
	)
})

// #####################
// Look into direct file links for protection
test('Fetch a tutorial by id', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a tutorial
	const createdTutorial = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	// Fetch a tutorial as admin
	const fetchedTutorial = await fetchTutorialById({
		status: 200,
		token: adminUser.token,
		id: createdTutorial.id,
	})

	// Check if the video is fetched correctly
	expect(fetchedTutorial.uri).toBe(`/videos/${tutorial1.vimeo_id}`)

	// @todo Check when you get Vimeo pro

	// Check if you cannot download
	// expect(fetchedTutorial.privacy.download).toBe(false)
	// expect(fetchedTutorial.privacy.privacy).toBe('public')

	// Fetch a tutorial as a user who hasn't bought the tutorial

	// Make sure the user doesn't have the URL but the preview URL
})

// Fetch tutorials with pagination
test('Fetch tutorials - with thumbnails, not URL', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create 5 tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	// Fetch latest 3 tutorials
	const fetchedTutorials = await fetchTutorialsPagination({
		token: userOne.token,
		start: 0,
		end: 2,
	})

	// Check if the order is correct and quantity, and only pictures are retrieved, not vimeo urls
	expect(fetchedTutorials.results.length).toBe(3)
	expect(fetchedTutorials.total).toBe(5)
	expect(fetchedTutorials.results[0].id).toBe(fifth.id)
	expect(fetchedTutorials.results[1].id).toBe(fourth.id)
	expect(fetchedTutorials.results[2].id).toBe(third.id)
})

// Create a tutorial bundle
test('Create a tutorial bundle', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a few tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	const tutorialIds = [first.id, second.id, third.id]

	// Create a tutorial bundle
	const createdBundle = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds },
	})
	const returnedTutorialIds = createdBundle.tutorials.map((t) => t.id)

	// Check if createdBundle matches
	compareValues({
		obj: createdBundle,
		values: { ...bundle1 },
	})
	compareValues({
		obj: returnedTutorialIds.sort(),
		values: { ...tutorialIds.sort() },
	})

	// Try to create a bundle with userOne and fail
	const errorText = await createBundle({
		status: 401,
		token: userOne.token,
		bundle: { ...bundle2 },
	})
	expect(errorText.msg).toBe('No admin privileges, access denied!')

	// Admin tries to create a bundle with the same name, fails
	const duplicateBundleMessage = await createBundle({
		status: 400,
		token: adminUser.token,
		bundle: { ...bundle1 },
	})
	expect(duplicateBundleMessage.msg).toBe(
		'There is already a bundle under that name!'
	)
})

// Fetch a tutorial bundle by id
test('Fetch a bundle by id', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a few tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const tutorialIds = [first.id, second.id, third.id]

	// Create a tutorial bundle
	const createdBundle = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds },
	})

	// Fetch a bundle as admin
	const fetchedBundle = await fetchBundleById({
		status: 200,
		token: adminUser.token,
		id: createdBundle.id,
	})

	// Check if the video is fetched correctly
	expect(fetchedBundle.uri).toBe(`/videos/${tutorial1.vimeo_id}`)
})

// Fetch tutorial bundle with pagination
test('Fetch bundles - with thumbnails, not URL', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create 5 tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	// Create a few bundles
	const tutorialIds1 = [first.id, second.id, third.id]
	const tutorialIds2 = [third.id, fourth.id, fifth.id]
	const tutorialIds3 = [first.id, fourth.id, fifth.id]
	const tutorialIds4 = [second.id, fourth.id, fifth.id]
	const tutorialIds5 = [first.id, second.id, fifth.id]

	const createdBundle1 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds: tutorialIds1 },
	})
	const createdBundle2 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle2, tutorialIds: tutorialIds2 },
	})
	const createdBundle3 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle3, tutorialIds: tutorialIds3 },
	})
	const createdBundle4 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle4, tutorialIds: tutorialIds4 },
	})
	const createdBundle5 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle5, tutorialIds: tutorialIds5 },
	})

	const fetchedBundles = await fetchBundlesPagination({
		token: userOne.token,
		start: 0,
		end: 2,
	})

	// Check if the order is correct and quantity, and only pictures are retrieved, not vimeo urls
	expect(fetchedBundles.results.length).toBe(3)
	expect(fetchedBundles.total).toBe(5)
	expect(fetchedBundles.results[0].id).toBe(createdBundle5.id)
	expect(fetchedBundles.results[1].id).toBe(createdBundle4.id)
	expect(fetchedBundles.results[2].id).toBe(createdBundle3.id)
})

// Delete tutorial
test('Delete tutorial', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a tutorial
	const createdTutorial = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	// User one tries to delete tutorial, fails
	await deleteTutorial({
		status: 401,
		token: userOne.token,
		tutorialId: createdTutorial.id,
	})

	// Admin successfully deletes tutorial
	const deletedTutorial = await deleteTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: createdTutorial.id,
	})
	expect(deletedTutorial.id).toBe(createdTutorial.id)

	// Check if there are no tutorials
	const allTutorials = await Tutorial.query()
	expect(allTutorials.length).toBe(0)
})

// Delete bundle
test('Delete bundle', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a few tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	const tutorialIds = [first.id, second.id, third.id]

	// Create a tutorial bundle
	const createdBundle = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds },
	})

	// User one tries to delete bundle, fails
	await deleteBundle({
		status: 401,
		token: userOne.token,
		bundleId: createdBundle.id,
	})

	// Admin successfully deletes bundle
	const deletedBundle = await deleteBundle({
		status: 200,
		token: adminUser.token,
		bundleId: createdBundle.id,
	})
	expect(deletedBundle.id).toBe(createdBundle.id)

	// Check if there are no bundles
	const allBundles = await TutorialBundle.query()
	expect(allBundles.length).toBe(0)

	// Check if there are still 5 tutorials
	const allTutorials = await Tutorial.query()
	expect(allTutorials.length).toBe(5)
})

// Archive tutorial (in case you -admin- are not satisfied no more with it, but users who bought it have it)
// You cannot buy archived tutorials
test('Archive tutorial', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a tutorial
	const createdTutorial = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	// User one tries to archive tutorial, fails
	await archiveTutorial({
		status: 401,
		token: userOne.token,
		tutorialId: createdTutorial.id,
	})

	// Admin successfully archives tutorial
	const archivedTutorial = await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: createdTutorial.id,
	})
	expect(archivedTutorial.id).toBe(createdTutorial.id)

	// Check if there are no active tutorials
	const allActiveTutorials = await Tutorial.query().where({ archived: false })
	expect(allActiveTutorials.length).toBe(0)

	// Check if there is 1 archived project
	const allArchivedTutorials = await Tutorial.query().where({ archived: true })
	expect(allArchivedTutorials.length).toBe(1)
	expect(allArchivedTutorials[0].id).toBe(createdTutorial.id)
})

// Archive tutorial bundle
test('Archive bundle', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a few tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const tutorialIds1 = [first.id, second.id, third.id]

	// Create a bundle
	const createdBundle = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds: tutorialIds1 },
	})

	// User one tries to archive bundle, fails
	await archiveBundle({
		status: 401,
		token: userOne.token,
		bundleId: createdBundle.id,
	})

	// Admin successfully archives bundle
	const archivedBundle = await archiveBundle({
		status: 200,
		token: adminUser.token,
		bundleId: createdBundle.id,
	})
	expect(archivedBundle.id).toBe(createdBundle.id)

	// Check if there are no active tutorials
	const allActiveBundles = await TutorialBundle.query().where({
		archived: false,
	})
	expect(allActiveBundles.length).toBe(0)

	// Check if there is 1 archived project
	const allArchivedBundles = await TutorialBundle.query().where({
		archived: true,
	})
	expect(allArchivedBundles.length).toBe(1)
	expect(allArchivedBundles[0].id).toBe(createdBundle.id)
})

// Search tutorials by name
test('Search tutorials by name', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create a few tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	const searchResults = await searchTutorials({ searchValue: 'kolo' })
	const searchResults2 = await searchTutorials({ searchValue: 'tehnika' })

	expect(searchResults.length).toBe(3)
	expect(searchResults2.length).toBe(2)

	// Check if it's not fetching archived tutorials
	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: first.id,
	})
	const searchResult3 = await searchTutorials({ searchValue: 'kolo' })
	expect(searchResult3.length).toBe(2)
})

// Search bundles by name
test('Search bundles by name', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create 5 tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	// Create a few bundles
	const tutorialIds1 = [first.id, second.id, third.id]
	const tutorialIds2 = [third.id, fourth.id, fifth.id]
	const tutorialIds3 = [first.id, fourth.id, fifth.id]
	const tutorialIds4 = [second.id, fourth.id, fifth.id]
	const tutorialIds5 = [first.id, second.id, fifth.id]

	const createdBundle1 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds: tutorialIds1 },
	})
	const createdBundle2 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle2, tutorialIds: tutorialIds2 },
	})
	const createdBundle3 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle3, tutorialIds: tutorialIds3 },
	})
	const createdBundle4 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle4, tutorialIds: tutorialIds4 },
	})
	const createdBundle5 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle5, tutorialIds: tutorialIds5 },
	})

	const searchResults = await searchBundles({ searchValue: 'sumadija' }) // sumadija, ciganija
	const searchResults2 = await searchBundles({ searchValue: 'pesma' }) // rumunske pesme

	expect(searchResults.length).toBe(2)
	expect(searchResults2.length).toBe(1)

	// Check if it's not fetching archived bundles
	await archiveBundle({
		status: 200,
		token: adminUser.token,
		bundleId: createdBundle2.id,
	})
	const searchResult3 = await searchBundles({ searchValue: 'sumadija' })
	expect(searchResult3.length).toBe(1)
	expect(searchResult3[0].name).toBe('Ciganija')
})

// /addTutorial, /addBundle, /removeTutorial, /removeBundle, /clearCart, /getProductsFromCart
test('Basic cart functionality', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create 5 tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	// Add a tutorial to cart
	const addedTutorial1 = await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: first.id,
	})

	const addedTutorial2 = await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: second.id,
	})

	expect(addedTutorial1.id).toBe(first.id)
	expect(addedTutorial2.id).toBe(second.id)

	// Remove a tutorial from cart
	const removedTutorial = await removeTutorialFromCart({
		token: userOne.token,
		status: 200,
		tutorialId: first.id,
	})

	expect(removedTutorial.id).toBe(first.id)

	const tutorialsFromCart = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})

	expect(tutorialsFromCart.tutorials.length).toBe(1)
	expect(tutorialsFromCart.tutorials[0].id).toBe(second.id)

	// User two registers
	await registerNewUser({ user: userTwo, status: 201 })

	// User two adds second, third, fourth tutorial to cart
	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: second.id,
	})
	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: third.id,
	})
	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: fourth.id,
	})

	// Check if both carts are correct
	const tutorialsFromCartUserOne = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})
	expect(tutorialsFromCartUserOne.tutorials.length).toBe(1)
	expect(tutorialsFromCartUserOne.tutorials[0].id).toBe(second.id)

	const tutorialsFromCartUserTwo = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})
	expect(tutorialsFromCartUserTwo.tutorials.length).toBe(3)
	expect(tutorialsFromCartUserTwo.tutorials[0].id).toBe(second.id)
	expect(tutorialsFromCartUserTwo.tutorials[1].id).toBe(third.id)
	expect(tutorialsFromCartUserTwo.tutorials[2].id).toBe(fourth.id)

	// User two removes second and third
	await removeTutorialFromCart({
		token: userTwo.token,
		status: 200,
		tutorialId: second.id,
	})
	await removeTutorialFromCart({
		token: userTwo.token,
		status: 200,
		tutorialId: third.id,
	})

	// Clear cart of user one
	await clearCart({ token: userOne.token, status: 200 })

	// Check if userOne's cart is empty
	const tutorialsFromCartUserOne2 = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})
	expect(tutorialsFromCartUserOne2.tutorials.length).toBe(0)

	// Check if userTwo's cart remains intact
	const tutorialsFromCartUserTwo2 = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})
	expect(tutorialsFromCartUserTwo2.tutorials.length).toBe(1)
	expect(tutorialsFromCartUserTwo2.tutorials[0].id).toBe(fourth.id)

	// Clear cart of user two
	await clearCart({ token: userTwo.token, status: 200 })

	// Check user two's cart
	const tutorialsFromCartUserTwo3 = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})
	expect(tutorialsFromCartUserTwo3.tutorials.length).toBe(0)

	// Cart status:
	// userOne: 0
	// userTwo: 0

	// Admin creates 3 tutorial bundles
	// Create a few bundles
	const tutorialIds1 = [first.id, second.id, third.id]
	const tutorialIds2 = [third.id, fourth.id, fifth.id]
	const tutorialIds3 = [first.id, fourth.id, fifth.id]
	const tutorialIds4 = [second.id, fourth.id, fifth.id]
	const tutorialIds5 = [first.id, second.id, fifth.id]

	const createdBundle1 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds: tutorialIds1 },
	})
	const createdBundle2 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle2, tutorialIds: tutorialIds2 },
	})
	const createdBundle3 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle3, tutorialIds: tutorialIds3 },
	})
	const createdBundle4 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle4, tutorialIds: tutorialIds4 },
	})
	const createdBundle5 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle5, tutorialIds: tutorialIds5 },
	})

	// User one adds a tutorial and one bundle
	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: second.id,
	})

	await addBundleToCart({
		token: userOne.token,
		status: 200,
		bundleId: createdBundle2.id,
	})

	// User one checks his cart
	const tutorialsFromCartUserOne3 = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})
	expect(tutorialsFromCartUserOne3.tutorials.length).toBe(1) // Dorcolka
	expect(tutorialsFromCartUserOne3.bundles.length).toBe(1) // Sumadija

	// User two adds 1 tutorial and 3 bundles
	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: first.id,
	})

	await addBundleToCart({
		token: userTwo.token,
		status: 200,
		bundleId: createdBundle1.id,
	})

	await addBundleToCart({
		token: userTwo.token,
		status: 200,
		bundleId: createdBundle2.id,
	})

	await addBundleToCart({
		token: userTwo.token,
		status: 200,
		bundleId: createdBundle3.id,
	})

	// User two checks his cart
	const tutorialsFromCartUserTwo4 = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})
	expect(tutorialsFromCartUserTwo4.tutorials.length).toBe(1) // Gunj kolo
	expect(tutorialsFromCartUserTwo4.bundles.length).toBe(3) // Rumunske pesme, Sumadija, Ciganija

	// User two successfully removes one bundle from cart
	const removedBundle = await removeBundleFromCart({
		token: userTwo.token,
		status: 200,
		bundleId: createdBundle1.id,
	})

	expect(removedBundle.id).toBe(createdBundle1.id)

	const productsUserTwo = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})

	expect(productsUserTwo.tutorials.length).toBe(1)
	expect(productsUserTwo.bundles.length).toBe(2)

	// User two clears cart
	await clearCart({ token: userTwo.token, status: 200 })

	// Check if empty
	const productsUserTwo2 = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})

	expect(productsUserTwo2.tutorials.length).toBe(0)
	expect(productsUserTwo2.bundles.length).toBe(0)

	// User one's cart remains the same
	const productsUserOne = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})
	expect(productsUserOne.tutorials.length).toBe(1) // Dorcolka
	expect(productsUserOne.bundles.length).toBe(1)
})
*/
// Buy products from cart, /charge
// That check could be an API + function that runs when the user clicks on enter card details and that function can be repeated - function returning list of products and total price
test('Buy products from cart', async () => {
	// Create an admin account with specified email
	await createAdminAccount({ status: 201 })

	// Create 5 tutorials
	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	// Add tutorials to cart
	const addedTutorial1 = await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: first.id,
	})

	const addedTutorial2 = await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: second.id,
	})

	await charge({ status: 200, token: userOne.token })

	// Check if user has 2 bought tutorials: Dorcolka and Gunj
	const userOneBoughtTutorials = await fetchBoughtTutorials({
		token: userOne.token,
		status: 200,
		start: 0,
		end: 10,
	})

	expect(userOneBoughtTutorials.total).toBe(2)
	const userOneBoughtTutorialsIds = userOneBoughtTutorials.results.map(
		(t) => t.id
	)
	expect(userOneBoughtTutorialsIds.some((i) => i === first.id)).toBe(true)
	expect(userOneBoughtTutorialsIds.some((i) => i === second.id)).toBe(true)

	// User tries to add tutorial 1, but since it's already bought, he fails
	const failedToAddTutorial = await addTutorialToCart({
		token: userOne.token,
		status: 400,
		tutorialId: first.id,
	})

	expect(failedToAddTutorial.msg).toBe(
		`Purchase failed - you've already bought this tutorial!`
	)

	// User adds tutorial 3, and then again, failing
	const addedTutorial3 = await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: third.id,
	})
	const addedTutorial3Fail = await addTutorialToCart({
		token: userOne.token,
		status: 400,
		tutorialId: third.id,
	})

	// User adds tutorial 4, admin archives it, user fails to purchase
	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fourth.id,
	})

	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: fourth.id,
	})

	await charge({
		status: 400,
		token: userOne.token,
	})

	// Admin archives fifth
	// User tries to add to cart, fails
	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: fifth.id,
	})

	await addTutorialToCart({
		token: userOne.token,
		status: 400,
		tutorialId: fifth.id,
	})

	// Create a few bundles
	const tutorialIds1 = [first.id, second.id, third.id]
	const tutorialIds2 = [third.id, fourth.id, fifth.id]
	const tutorialIds3 = [first.id, fourth.id, fifth.id]
	const tutorialIds4 = [second.id, fourth.id, fifth.id]
	const tutorialIds5 = [first.id, second.id, fifth.id]

	const createdBundle1 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds: tutorialIds1 },
	})
	const createdBundle2 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle2, tutorialIds: tutorialIds2 },
	})
	const createdBundle3 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle3, tutorialIds: tutorialIds3 },
	})
	const createdBundle4 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle4, tutorialIds: tutorialIds4 },
	})
	const createdBundle5 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle5, tutorialIds: tutorialIds5 },
	})

	// User two registers
	// User two adds tutorial 1, 2 to cart
	// User two adds bundle 1, 2 to cart
	// Admin archives bundle 2
	// User two fetches cart, has only bundle in cart
	// User tries to add archived bundle, fails
	await registerNewUser({ user: userTwo, status: 201 })

	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: first.id,
	})

	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: second.id,
	})

	await addBundleToCart({
		token: userTwo.token,
		status: 200,
		bundleId: createdBundle1.id,
	})

	await addBundleToCart({
		token: userTwo.token,
		status: 400,
		bundleId: createdBundle1.id,
	})

	await addBundleToCart({
		token: userTwo.token,
		status: 200,
		bundleId: createdBundle2.id,
	})

	await archiveBundle({
		status: 200,
		token: adminUser.token,
		bundleId: createdBundle2.id,
	})

	const userTwoCartProducts = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
		test: true,
	})

	expect(userTwoCartProducts.tutorials.length).toBe(2) // dorcolka & gunj
	expect(userTwoCartProducts.bundles.length).toBe(1) // bundle 1 (dorcolka, gunj, u zanosu tehnike)
	expect(userTwoCartProducts.bundles[0].id).toBe(createdBundle1.id) // bundle 1

	await addBundleToCart({
		token: userTwo.token,
		status: 404,
		bundleId: createdBundle2.id,
	})

	// There are 2 tutorials and 1 bundle consisted of those 2 tutorials + third
	const errorMessage = await charge({
		status: 400,
		token: userTwo.token,
		test: true,
	})

	const userTwoBoughtTutorials = await fetchBoughtTutorials({
		token: userTwo.token,
		status: 200,
		test: true
	})

	expect(userTwoBoughtTutorials.length).toBe(0)
})
/*
test('Clearing archived products from cart upon /addTutorial', async () => {
	// Create an admin account with specified email
	// Create 5 tutorials
	// Create 5 bundles
	await createAdminAccount({ status: 201 })

	const first = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})

	const second = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial2 },
	})

	const third = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial3 },
	})

	const fourth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial4 },
	})

	const fifth = await createTutorial({
		status: 201,
		token: adminUser.token,
		tutorial: { ...tutorial5 },
	})

	// Create a few bundles
	const tutorialIds1 = [first.id, second.id, third.id]
	const tutorialIds2 = [third.id, fourth.id, fifth.id]
	const tutorialIds3 = [first.id, fourth.id, fifth.id]
	const tutorialIds4 = [second.id, fourth.id, fifth.id]
	const tutorialIds5 = [first.id, second.id, fifth.id]

	const createdBundle1 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle1, tutorialIds: tutorialIds1 },
	})
	const createdBundle2 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle2, tutorialIds: tutorialIds2 },
	})
	const createdBundle3 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle3, tutorialIds: tutorialIds3 },
	})
	const createdBundle4 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle4, tutorialIds: tutorialIds4 },
	})
	const createdBundle5 = await createBundle({
		status: 201,
		token: adminUser.token,
		bundle: { ...bundle5, tutorialIds: tutorialIds5 },
	})

	// User one adds tutorials: 1, 2, 3 to cart
	// Admin archives tutorial 1
	// Fetch user's tutorials from cart
	// Check if there is no tutorial 1 in cart
	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: first.id,
	})
	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: second.id,
	})
	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: third.id,
	})

	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: first.id,
	})

	const userOneCartTutorials = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})

	// User one adds bundles: 1, 2, 3 to cart
	// Admin archives bundle 1 and 4
	// Fetch user's bundles from cart
	// Check if there is no bundle 1 in cart

	// User one one fails to add bundle 2 since already added

	// User tries to add bundle 4, but fails since it's archived

	// User one buys bundle 2, 3
	// User tries to add bundle 2, but fails since already bought
})
*/
// Fetch my tutorials (archived or not, doesn't matter)
// User has many tutorials (bought) and also many tutorial bundles (bought
