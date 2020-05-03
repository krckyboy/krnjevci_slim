const request = require('supertest')
const app = require('../app')
const {
	registerNewUser,
	login,
	userOne,
	userTwo,
	userThree,
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
	searchTutorials,
	charge,
	addTutorialToCart,
	removeTutorialFromCart,
	getAllProductsFromCart,
	clearCart,
	fetchBoughtTutorials,
	refreshCart,
} = require('./utils')

const User = require('../db/models/User')
const Tutorial = require('../db/models/Tutorial')
const Cart = require('../db/models/Cart')
const Purchase = require('../db/models/Purchase')

beforeEach(async () => {
	await User.query().delete()
	await Tutorial.query().delete()
	await Cart.query().delete()
	await Purchase.query().delete()
	await registerNewUser({ user: userOne, status: 201 })
})

afterAll(async () => {
	await User.query().delete()
	await Tutorial.query().delete()
	await Cart.query().delete()
	await Purchase.query().delete()
})

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

	const validationFail = await registerNewUser({
		user: {
			email: 'userone@com',
			password: null,
		},
		status: 400,
	})

	expect(validationFail.errors.length).toBe(2)
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
	expect(responseLoginFail.msg).toBe(
		'Uneti podaci se ne poklapaju sa bazom podataka!'
	)

	// When password doesn't match, return 400
	const responseLoginFail2 = await login({
		user: { email: userOne.email, password: 'invalidPassword' },
		status: 400,
	})
	expect(responseLoginFail2.msg).toBe(
		'Uneti podaci se ne poklapaju sa bazom podataka!'
	)
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
	expect(errorText.msg).toBe('Pristup onemogućen!')

	// Admin tries to create a tutorial with the same name, fails
	const duplicateTutorialMessage = await createTutorial({
		status: 400,
		token: adminUser.token,
		tutorial: { ...tutorial1 },
	})
	expect(duplicateTutorialMessage.msg).toBe(
		'Već postoji tutorijal sa takvim imenom!'
	)
})

// Look into direct file links for protection
test('Fetch a tutorial by id', async () => {
	// If not exist, 404
	// If archived, 404
	// If not bought, pass preview_id
	// If bought, pass vimeo_id
	// If admin, get all info
	// If admin, gets vimeo_id even if not bought
	// FE: Check if you even need the vimeo code in this route (probably not)

	// Admin creates 3 tutorials
	// Admin archives tutorial #3
	// User tries to fetch a tutorial that doesn't exist, gets 404
	// User tries to fetch archived tutorial (t3), gets 404
	// Admin can fetch archived
	// Admin also automatically gets vimeo_id and preview_id
	// User buys t2
	// When fetching t2, he gets vimeo_id
	// When fetching t1, he doesn't get vimeo_id, just preview

	// Create an admin account with specified email
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

	await archiveTutorial({
		tutorialId: third.id,
		token: adminUser.token,
		status: 200,
	})

	// User failing to get unexisted and archived project
	await fetchTutorialById({
		status: 404,
		token: userOne.token,
		id: 34636363,
	})

	await fetchTutorialById({
		status: 404,
		token: userOne.token,
		id: third.id,
	})

	// Fetch archived tutorial (t3) as admin, successfully
	const fetchedThirdAsAdmin = await fetchTutorialById({
		status: 200,
		token: adminUser.token,
		id: third.id,
	})

	expect(fetchedThirdAsAdmin.userBoughtTutorial).toBe(true)
	expect(fetchedThirdAsAdmin.tutorial.vimeo_id).toBe(third.vimeo_id)
	expect(fetchedThirdAsAdmin.tutorial.vimeo_preview_id).toBe(
		third.vimeo_preview_id
	)

	// User fetches t1, the one he didn't buy
	const userFetchesNonbought = await fetchTutorialById({
		status: 200,
		token: userOne.token,
		id: first.id,
	})

	expect(userFetchesNonbought.userBoughtTutorial).toBe(false)
	expect(userFetchesNonbought.tutorial.vimeo_id).toBe(undefined)
	expect(userFetchesNonbought.tutorial.vimeo_preview_id).toBe(
		first.vimeo_preview_id
	)

	// User adds to cart t2
	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: second.id,
	})

	await charge({ status: 200, token: userOne.token })

	const userFetchesBought = await fetchTutorialById({
		status: 200,
		token: userOne.token,
		id: second.id,
	})

	expect(userFetchesBought.userBoughtTutorial).toBe(true)
	expect(userFetchesBought.tutorial.vimeo_id).toBe(second.vimeo_id)
	expect(userFetchesBought.tutorial.vimeo_preview_id).toBe(
		second.vimeo_preview_id
	)

	// @todo Check when you get Vimeo pro

	// Check if you cannot download
	// expect(fetchedTutorial.privacy.download).toBe(false)
	// expect(fetchedTutorial.privacy.privacy).toBe('public')

	// Fetch a tutorial as a user who hasn't bought the tutorial

	// Make sure the user doesn't have the URL but the preview URL
})

// Fetch tutorials with pagination
test('Fetch tutorials - with thumbnails, not URL', async () => {
	// Fetch only non archived
	// Check if pagination works as intended

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

// Search tutorials by name
test('Search tutorials by name', async () => {
	// Fetch only non archived

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

// Cart /addTutorial
test('/addTutorial', async () => {
	// 404 if not exist
	// 404 if archived
	// 400 if already added to cart
	// 400 if already bought
	// Check if carts are unique to individual users

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

	// Add 2 tutorials to cart
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

	// 404 when not exist
	await addTutorialToCart({
		token: userOne.token,
		status: 404,
		tutorialId: 9999,
	})

	// Admin archives tutorial 3
	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: third.id,
	})

	// Fail to add archived tutorial
	const notFoundMessage = await addTutorialToCart({
		token: userOne.token,
		status: 404,
		tutorialId: third.id,
	})

	expect(notFoundMessage.msg).toBe('Artikl ne postoji!')

	const alreadyAddedMessage = await addTutorialToCart({
		token: userOne.token,
		status: 400,
		tutorialId: first.id,
	})

	expect(alreadyAddedMessage.msg).toBe('Artikl je već dodat u korpu!')

	// Fetch user one's cart, make sure it's 2, tutorial 1 and 2
	const userOneCartProducts = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})

	// There are 2 tutorials in cart
	expect(userOneCartProducts.products.tutorials.total).toBe(2)
	expect(userOneCartProducts.products.tutorials.results[0].id).toBe(first.id)
	expect(userOneCartProducts.products.tutorials.results[1].id).toBe(second.id)

	// User makes the purchase, buying 2 tutorials: 1, 2
	await charge({
		status: 200,
		token: userOne.token,
		test: true,
	})

	// Check if user has 2 bought tutorials
	const userOneBoughtTutorials = await fetchBoughtTutorials({
		token: userOne.token,
		status: 200,
		test: true,
	})

	expect(userOneBoughtTutorials.tutorials.total).toBe(2)
	const boughtTutorialsIds = userOneBoughtTutorials.tutorials.results.map(
		(t) => t.id
	)

	expect(boughtTutorialsIds.includes(first.id)).toBe(true)
	expect(boughtTutorialsIds.includes(second.id)).toBe(true)

	const alreadyBoughtMsg = await addTutorialToCart({
		token: userOne.token,
		status: 400,
		tutorialId: first.id,
	})

	expect(alreadyBoughtMsg.msg).toBe(
		'Ne možete dodati artikl koji sve već kupili!'
	)

	// User two registers
	// User three registers
	await registerNewUser({
		user: userTwo,
		status: 201,
	})

	await registerNewUser({
		user: userThree,
		status: 201,
	})

	// User two adds 1, 2 tutorials
	// User three adds 2, 3
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

	await addTutorialToCart({
		token: userThree.token,
		status: 200,
		tutorialId: second.id,
	})

	await addTutorialToCart({
		token: userThree.token,
		status: 200,
		tutorialId: fourth.id,
	})

	// User two has 1, 2 tutorials
	// User three has 2, 4 tutorials
	const userTwoCartProducts = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})

	const userThreeCartProducts = await getAllProductsFromCart({
		token: userThree.token,
		status: 200,
	})

	expect(userTwoCartProducts.products.tutorials.total).toBe(2)
	const userTwoCartProductsIds = userTwoCartProducts.products.tutorials.results.map(
		(t) => t.id
	)
	expect(userTwoCartProductsIds.includes(first.id)).toBe(true)
	expect(userTwoCartProductsIds.includes(second.id)).toBe(true)

	const userThreeCartProductsIds = userThreeCartProducts.products.tutorials.results.map(
		(t) => t.id
	)
	expect(userThreeCartProducts.products.tutorials.total).toBe(2)
	expect(userThreeCartProductsIds.includes(second.id)).toBe(true)
	expect(userThreeCartProductsIds.includes(fourth.id)).toBe(true)

	// User two and three make the purchase
	await charge({
		status: 200,
		token: userTwo.token,
		test: true,
	})

	await charge({
		status: 200,
		token: userThree.token,
		test: true,
	})

	// User two has 1, 2 bought tutorials
	// User three has 2, 3 bought tutorials
	const userTwoBoughtTutorials = await fetchBoughtTutorials({
		token: userTwo.token,
		status: 200,
		test: true,
	})

	expect(userTwoBoughtTutorials.tutorials.total).toBe(2)
	const userTwoBoughtTutorialsIds = userTwoBoughtTutorials.tutorials.results.map(
		(t) => t.id
	)

	expect(userTwoBoughtTutorialsIds.includes(first.id))
	expect(userTwoBoughtTutorialsIds.includes(second.id))

	const userThreeBoughtTutorials = await fetchBoughtTutorials({
		token: userThree.token,
		status: 200,
		test: true,
	})

	expect(userThreeBoughtTutorials.tutorials.total).toBe(2)
	const userThreeBoughtTutorialsIds = userThreeBoughtTutorials.tutorials.results.map(
		(t) => t.id
	)

	expect(userThreeBoughtTutorialsIds.includes(second.id))
	expect(userThreeBoughtTutorialsIds.includes(fourth.id))
})

// Cart /removeTutorial
test('/removeTutorial', async () => {
	// 404 if not exist
	// 404 if not added to cart
	// Check if carts are unique to individual users
	// 200 if removing archived

	await createAdminAccount({ status: 201 })

	await registerNewUser({
		user: userTwo,
		status: 201,
	})

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

	// User one adds 1, 2, 3 tutorials
	// User two adds 3, 4, 5
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

	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: fifth.id,
	})

	// User one removes 3, has only 1, 2 in cart
	// User two removes 5, has only 3, 4 in cart
	await removeTutorialFromCart({
		token: userOne.token,
		status: 200,
		tutorialId: third.id,
	})

	await removeTutorialFromCart({
		token: userTwo.token,
		status: 200,
		tutorialId: fifth.id,
	})

	// Fetch user one's cart, make sure it's 2, tutorial 1 and 2
	const userOneCartProducts = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})

	// There are 2 tutorials in cart
	expect(userOneCartProducts.products.tutorials.total).toBe(2)
	const userOneTutorialIds = userOneCartProducts.products.tutorials.results.map(
		(t) => t.id
	)
	expect(userOneTutorialIds.includes(first.id)).toBe(true)
	expect(userOneTutorialIds.includes(second.id)).toBe(true)

	// Fetch user two's cart, make sure it's 2, tutorial 3 and 4
	const userTwoCartProducts = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})

	// There are 2 tutorials in cart
	expect(userTwoCartProducts.products.tutorials.total).toBe(2)
	const userTwoTutorialIds = userTwoCartProducts.products.tutorials.results.map(
		(t) => t.id
	)
	expect(userTwoTutorialIds.includes(third.id)).toBe(true)
	expect(userTwoTutorialIds.includes(fourth.id)).toBe(true)

	// User one: 1, 2
	// User two: 3, 4

	// Admin archives tutorial 2
	// User one has tutorial 1, 2
	// User one can successfully remove tutorial 2 even if it's archived
	// User two has tutorial 3, 4
	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: second.id,
	})

	await removeTutorialFromCart({
		token: userOne.token,
		status: 200,
		tutorialId: second.id,
		test: true,
	})

	// Fetch user one's cart
	const userOneCartProductsSecond = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})

	// There are 2 tutorials in cart
	expect(userOneCartProductsSecond.products.tutorials.total).toBe(1)
	expect(userOneCartProductsSecond.products.tutorials.results[0].id).toBe(
		first.id
	)

	// Fetch user two's cart, make sure it's 2, tutorial 3 and 4
	const userTwoCartProductsSecond = await getAllProductsFromCart({
		token: userTwo.token,
		status: 200,
	})

	// There are 2 tutorials in cart
	expect(userTwoCartProductsSecond.products.tutorials.total).toBe(2)
	const userTwoTutorialIdsSecond = userTwoCartProductsSecond.products.tutorials.results.map(
		(t) => t.id
	)
	expect(userTwoTutorialIdsSecond.includes(third.id)).toBe(true)
	expect(userTwoTutorialIdsSecond.includes(fourth.id)).toBe(true)

	// User one gets 404 when trying to remove a tutorial that doesn't exist
	// User one gets 404 when trying to remove a tutorial he didn't add to cart
	await removeTutorialFromCart({
		token: userOne.token,
		status: 404,
		tutorialId: 8888888,
	})

	await removeTutorialFromCart({
		token: userOne.token,
		status: 404,
		tutorialId: fifth.id,
	})
})

// Cart /getAllProducts
test('/getAllProducts', async () => {
	// Remove archived tutorials
	// Check if pagination works as intended

	// User adds 5 tutorials to cart
	// User archives tutorial 5
	// User has 4 tutorials, excluding tutorial 5
	// Pagination works, fetching latest 2

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

	// Add 2 tutorials to cart
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

	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fourth.id,
	})

	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fifth.id,
	})

	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: fifth.id,
	})

	const userOneCartProducts = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
	})

	expect(userOneCartProducts.products.tutorials.total).toBe(4)
	const userOneTutorialIds = userOneCartProducts.products.tutorials.results.map(
		(t) => t.id
	)
	expect(userOneTutorialIds.includes(first.id)).toBe(true)
	expect(userOneTutorialIds.includes(second.id)).toBe(true)
	expect(userOneTutorialIds.includes(third.id)).toBe(true)
	expect(userOneTutorialIds.includes(fourth.id)).toBe(true)
	expect(userOneTutorialIds.includes(fifth.id)).toBe(false)

	const userOneCartProductsOnly2 = await getAllProductsFromCart({
		token: userOne.token,
		status: 200,
		start: 0,
		end: 1,
	})

	expect(userOneCartProductsOnly2.products.tutorials.total).toBe(4)
	expect(userOneCartProductsOnly2.products.tutorials.results.length).toBe(2)
})

// Cart /refreshCart
test('/refreshCart', async () => {
	// Remove archived tutorials
	// Check if carts are unique to individual users

	// User adds 5 tutorials to cart
	// User two adds tutorial 3, 4
	// User archives tutorial 4, 5
	// /refreshCart gets hit
	// User has 3 tutorials, excluding tutorial 4, 5
	// User two has only tutorial 3, excluding 4

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

	// Add 5 tutorials to cart
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

	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fourth.id,
	})

	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fifth.id,
	})

	await registerNewUser({ user: userTwo, status: 201 })

	// User two adds tutorial 3, 4
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

	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: fourth.id,
	})

	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: fifth.id,
	})

	// Hit /refreshCart API
	await refreshCart({ token: userOne.token, status: 200 })

	const tutorialsInCartUserOne = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userOne.id })

	const tutorialsInCartUserOneIds = tutorialsInCartUserOne.map((t) => t.id)

	expect(tutorialsInCartUserOneIds.includes(first.id)).toBe(true)
	expect(tutorialsInCartUserOneIds.includes(second.id)).toBe(true)
	expect(tutorialsInCartUserOneIds.includes(third.id)).toBe(true)
	expect(tutorialsInCartUserOneIds.includes(fourth.id)).toBe(false)
	expect(tutorialsInCartUserOneIds.includes(fifth.id)).toBe(false)

	// User two has two tutorials before /refreshing
	const tutorialsInCartUserTwo = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userTwo.id })

	expect(tutorialsInCartUserTwo.length).toBe(2)
	const tutorialsInCartUserTwoIds = tutorialsInCartUserTwo.map((t) => t.id)
	expect(tutorialsInCartUserTwoIds.includes(third.id)).toBe(true)
	expect(tutorialsInCartUserTwoIds.includes(fourth.id)).toBe(true)

	// After refreshing, user two has 1
	await refreshCart({ token: userTwo.token, status: 200 })

	const tutorialsInCartUserTwoSecond = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userTwo.id })

	expect(tutorialsInCartUserTwoSecond.length).toBe(1)
	expect(tutorialsInCartUserTwoSecond[0].id).toBe(third.id)
})

// Cart /clearCart
test('/clear', async () => {
	// User adds 5 tutorials to cart
	// User two adds 2 tutorials
	// User clears cart
	// User has 0 tutorials in cart
	// User two still has 2 tutorials

	await registerNewUser({ user: userTwo, status: 201 })

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

	// Add 5 tutorials to cart
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

	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fourth.id,
	})

	await addTutorialToCart({
		token: userOne.token,
		status: 200,
		tutorialId: fifth.id,
	})

	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: fourth.id,
	})

	await addTutorialToCart({
		token: userTwo.token,
		status: 200,
		tutorialId: fifth.id,
	})

	// Hit /clearCart API
	await clearCart({ token: userOne.token, status: 200 })

	const tutorialsInCart = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userOne.id })

	expect(tutorialsInCart.length).toBe(0)

	// User two still has 2 tutorials
	const tutorialsInCartUserTwo = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userTwo.id })

	expect(tutorialsInCartUserTwo.length).toBe(2)
})

// In FE, make sure to hit /refreshCart as a validation before redirecting to this API / page for purchase
test('/charge', async () => {
	// 400 if archived tutorials found, but don’t update cart, leave that to /refreshCart
	// Check if bought tutorials are unique to individual users
	// Check if cart is empty after purchase

	// User one adds 1, 2, 3 to cart
	// User two adds 3, 4
	// Admin archives 4

	// User one successfully buys 1, 2, 3
	// User two gets 400 since tutorial 4 is archived
	// User two tries to purchase once again, but gets 400 again
	// User two refreshes cart and then successfully makes the purchase
	// User one's cart is empty
	// User two's cart is empty, as well

	// User one fetches bought tutorials, has 1, 2, 3
	// User two fetches bought tutorials, has 3

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

	// Users adding tutorials to cart
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

	await registerNewUser({ user: userTwo, status: 201 })

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

	// Archiving
	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: fourth.id,
	})

	// Purchase
	await charge({
		status: 200,
		token: userOne.token,
	})

	// User two fails
	await charge({
		status: 400,
		token: userTwo.token,
	})

	// User two fails again
	await charge({
		status: 400,
		token: userTwo.token,
	})

	await refreshCart({ token: userTwo.token, status: 200 })

	await charge({
		status: 200,
		token: userTwo.token,
	})

	const tutorialsInCartOne = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userOne.id })

	expect(tutorialsInCartOne.length).toBe(0)

	const tutorialsInCartTwo = await Tutorial.query()
		.select(
			'tutorials.id',
			'tutorials.name',
			'tutorials.description',
			'tutorials.price',
			'tutorials.archived'
		)
		.joinRelation('cart_tutorials')
		.where({ user_id: userTwo.id })

	expect(tutorialsInCartTwo.length).toBe(0)

	// Check what tutorials are bought
	const userOneBoughtTutorials = await fetchBoughtTutorials({
		token: userOne.token,
		status: 200,
		test: true,
	})

	expect(userOneBoughtTutorials.tutorials.total).toBe(3)
	const boughtTutorialsIds = userOneBoughtTutorials.tutorials.results.map(
		(t) => t.id
	)

	expect(boughtTutorialsIds.includes(first.id)).toBe(true)
	expect(boughtTutorialsIds.includes(second.id)).toBe(true)
	expect(boughtTutorialsIds.includes(third.id)).toBe(true)

	const userTwoBoughtTutorials = await fetchBoughtTutorials({
		token: userTwo.token,
		status: 200,
		test: true,
	})

	expect(userTwoBoughtTutorials.tutorials.total).toBe(1)
	expect(userTwoBoughtTutorials.tutorials.results[0].id).toBe(third.id)
})

test('/fetchBoughtTutorials', async () => {
	// Make sure to also get archived
	// When fetching 0 bought, make sure it’s the same structure
	// Make sure the pagination works

	// User buys t1 t2 t3
	// Admin archives t3
	// Fetch bought tutorials, total being 3, including the archived one
	// Check pagination

	// User two registers
	// User two fetches bought tutorials, getting none

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

	await charge({
		status: 200,
		token: userOne.token,
	})

	await archiveTutorial({
		status: 200,
		token: adminUser.token,
		tutorialId: third.id,
	})

	const userOneBoughtTutorials = await fetchBoughtTutorials({
		token: userOne.token,
		status: 200,
		test: true,
	})

	expect(userOneBoughtTutorials.tutorials.total).toBe(3)
	const boughtTutorialsIds = userOneBoughtTutorials.tutorials.results.map(
		(t) => t.id
	)

	expect(boughtTutorialsIds.includes(first.id)).toBe(true)
	expect(boughtTutorialsIds.includes(second.id)).toBe(true)
	expect(boughtTutorialsIds.includes(third.id)).toBe(true)

	const archivedTut = userOneBoughtTutorials.tutorials.results.find(
		(t) => t.archived
	)

	expect(archivedTut.id).toBe(third.id)
	expect(archivedTut.archived).toBe(true)

	const userOneBoughtTutorialsPag = await fetchBoughtTutorials({
		token: userOne.token,
		status: 200,
		start: 0,
		end: 1,
	})

	expect(userOneBoughtTutorialsPag.tutorials.total).toBe(3)
	expect(userOneBoughtTutorialsPag.tutorials.results.length).toBe(2)

	await registerNewUser({ user: userTwo, status: 201 })

	const userTwoBoughtTutorials = await fetchBoughtTutorials({
		token: userTwo.token,
		status: 200,
		test: true,
	})

	expect(userTwoBoughtTutorials.tutorials.total).toBe(0)
	expect(userTwoBoughtTutorials.tutorials.results.length).toBe(0)
})
