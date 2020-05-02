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

	expect(boughtTutorialsIds.includes(first.id))
	expect(boughtTutorialsIds.includes(second.id))

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

// Buy products from cart, /charge
// That check could be an API + function that runs when the user clicks on enter card details and that function can be repeated - function returning list of products and total price
test('Buy products from cart', async () => {})

test('Clearing archived products from cart upon /addTutorial', async () => {})

// Fetch my tutorials (archived or not, doesn't matter)
