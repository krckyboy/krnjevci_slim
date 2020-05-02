const request = require('supertest')
const app = require('../app')
const jwtDecode = require('jwt-decode')

const adminUser = {
	email: 'dusan.todorovic.2016@gmail.com',
	password: 'password',
	token: '',
	id: '',
}

const userOne = {
	email: 'userone@gmail.com',
	password: 'password',
	token: '',
	id: '',
}

const userTwo = {
	email: 'userTwo@gmail.com',
	password: 'password',
	token: '',
	id: '',
}

const tutorial1 = {
	name: 'Gunj kolo',
	vimeo_id: '408197065',
	vimeo_preview_id: 'tutorial1preview',
	price: 1000,
	description: 'The author of this composition is Tomica Miljić',
}

const tutorial2 = {
	name: 'Dorcolka kolo',
	vimeo_id: '402640509',
	vimeo_preview_id: 'www.vimeo/video/tutorial#2preview',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const tutorial3 = {
	name: 'U zanosu tehnike',
	vimeo_id: '407271410',
	vimeo_preview_id: 'www.vimeo/video/tutorial#3preview',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const tutorial4 = {
	name: 'Tehnicko kolo',
	vimeo_id: '410448352',
	vimeo_preview_id: 'www.vimeo/video/tutorial#4preview',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const tutorial5 = {
	name: 'tutorial#5',
	vimeo_id: '405862926',
	vimeo_preview_id: 'www.vimeo/video/tutorial#5preview',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const bundle1 = {
	name: 'Rumunske pesme',
	vimeo_id: '408197065',
	price: 1000,
	description: 'Hora Martisor i ostalo',
}

const bundle2 = {
	name: 'Sumadija',
	vimeo_id: '402640509',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const bundle3 = {
	name: 'Ciganija',
	vimeo_id: '407271410',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const bundle4 = {
	name: 'Turski melos',
	vimeo_id: '410448352',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

const bundle5 = {
	name: 'Sevdalinke',
	vimeo_id: '405862926',
	price: 1000,
	description: 'The author of this composition is Dusan Todorovic Krnjevac',
}

async function registerNewUser({ user, status = 201 }) {
	const res = await request(app)
		.post('/api/users')
		.send({ ...user })
		.expect(status)

	user.token = res.body.token

	// Update the referenced object passed to the function.
	if (res.body.token) {
		user.id = jwtDecode(res.body.token).user.id
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function login({ user, status = 200 }) {
	const res = await request(app)
		.post('/api/users/login')
		.send({ ...user })
		.expect(status)

	if (res.body.token) {
		return res.body.token
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function createTutorial({ tutorial, status = 201, token }) {
	const res = await request(app)
		.post(`/api/tutorials`)
		.set('Authorization', `Bearer ${token}`)
		.send({ ...tutorial })
		.expect(status)

	if (res.body.tutorial) {
		return res.body.tutorial
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function createBundle({ bundle, status = 201, token }) {
	const res = await request(app)
		.post(`/api/tutorials/bundle`)
		.set('Authorization', `Bearer ${token}`)
		.send({ ...bundle })
		.expect(status)

	if (res.body.bundle) {
		return res.body.bundle
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function createAdminAccount({ status = 201 }) {
	const res = await request(app)
		.post('/api/users')
		.send({ ...adminUser })
		.expect(status)

	adminUser.token = res.body.token

	// Update the referenced object passed to the function.
	if (res.body.token) {
		adminUser.id = jwtDecode(res.body.token).user.id
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

function compareValues({ obj, values }) {
	const valuesAsArr = Object.entries(values)

	// Check each individual value count
	valuesAsArr.forEach((el) => {
		const valueFromObj = obj[[el[0]]]
		const valueFromValues = el[1]
		expect(valueFromObj).toBe(valueFromValues)
	})
}

async function fetchTutorialById({ status = 200, token, id }) {
	const res = await request(app)
		.get(`/api/tutorials/${id}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.tutorial) {
		return res.body.tutorial
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function fetchBundleById({ status = 200, token, id }) {
	const res = await request(app)
		.get(`/api/tutorials/bundle/${id}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.bundle) {
		return res.body.bundle
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function deleteTutorial({ tutorialId, token, status = 200 }) {
	const res = await request(app)
		.delete(`/api/tutorials/${tutorialId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.tutorial) {
		return res.body.tutorial
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function deleteBundle({ bundleId, token, status = 200 }) {
	const res = await request(app)
		.delete(`/api/tutorials/bundle/${bundleId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.bundle) {
		return res.body.bundle
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function archiveTutorial({ tutorialId, token, status = 200 }) {
	const res = await request(app)
		.post(`/api/tutorials/archive/${tutorialId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.tutorial) {
		return res.body.tutorial
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function archiveBundle({ bundleId, token, status = 200 }) {
	const res = await request(app)
		.post(`/api/tutorials/archive/bundle/${bundleId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.bundle) {
		return res.body.bundle
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function fetchTutorialsPagination({ token, status = 200, start, end }) {
	const res = await request(app)
		.get(`/api/tutorials/?start=${start}&end=${end}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	return res.body.tutorials
}

async function fetchBundlesPagination({ token, status = 200, start, end }) {
	const res = await request(app)
		.get(`/api/tutorials/bundle/?start=${start}&end=${end}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	return res.body.bundles
}

async function searchTutorials({ status = 200, searchValue }) {
	const res = await request(app)
		.get('/api/tutorials/search')
		.expect(status)
		.send({ search: searchValue })

	return res.body.tutorials
}

async function searchBundles({ status = 200, searchValue }) {
	const res = await request(app)
		.get('/api/tutorials/bundle/search')
		.expect(status)
		.send({ search: searchValue })

	return res.body.bundles
}

async function charge({ status = 200, token, test = false }) {
	const res = await request(app)
		.post('/api/charge')
		.set('Authorization', `Bearer ${token}`)
		.expect(status)
		.send({ test })

	if (res.body.tutorials) {
		return res.body.tutorials
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function addTutorialToCart({ tutorialId, token, status = 200 }) {
	const res = await request(app)
		.post(`/api/cart/tutorial/${tutorialId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.tutorial) {
		return res.body.tutorial
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function addBundleToCart({ bundleId, token, status = 200 }) {
	const res = await request(app)
		.post(`/api/cart/bundle/${bundleId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.bundle) {
		return res.body.bundle
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function removeTutorialFromCart({ tutorialId, token, status = 200 }) {
	const res = await request(app)
		.delete(`/api/cart/tutorial/${tutorialId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.tutorial) {
		return res.body.tutorial
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function removeBundleFromCart({ bundleId, token, status = 200 }) {
	const res = await request(app)
		.delete(`/api/cart/bundle/${bundleId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.bundle) {
		return res.body.bundle
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function getAllProductsFromCart({ token, status = 200, test = false }) {
	const res = await request(app)
		.get(`/api/cart/`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)
		.send({ test })

	if (res.body.products) {
		return res.body.products
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

async function clearCart({ token, status = 200 }) {
	await request(app)
		.delete(`/api/cart/`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)
}

async function fetchBoughtTutorials({ token, status = 200, start, end, test = false }) {
	const res = await request(app)
		.get(`/api/tutorials/bought?start=${start}&end=${end}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)
		.send({ test })

	if (res.body.tutorials) {
		return res.body.tutorials
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}
async function fetchBundlesOfTutorial({ token, status = 200, tutorialId }) {
	const res = await request(app)
		.get(`/api/tutorials/fetchBundlesOfTutorial/${tutorialId}`)
		.set('Authorization', `Bearer ${token}`)
		.expect(status)

	if (res.body.bundles) {
		return res.body.bundles
	} else {
		const errorObject = JSON.parse(res.error.text)
		return errorObject
	}
}

module.exports = {
	userOne,
	userTwo,
	adminUser,
	tutorial1,
	tutorial2,
	tutorial3,
	tutorial4,
	tutorial5,
	bundle1,
	bundle2,
	bundle3,
	bundle4,
	bundle5,
	registerNewUser,
	login,
	removeBundleFromCart,
	createTutorial,
	createAdminAccount,
	compareValues,
	fetchTutorialById,
	deleteTutorial,
	archiveTutorial,
	createBundle,
	fetchTutorialsPagination,
	fetchBundleById,
	fetchBundlesPagination,
	archiveBundle,
	deleteBundle,
	searchTutorials,
	searchBundles,
	charge,
	addTutorialToCart,
	removeTutorialFromCart,
	getAllProductsFromCart,
	clearCart,
	addBundleToCart,
	fetchBoughtTutorials,
	fetchBundlesOfTutorial,
}
