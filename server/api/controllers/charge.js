const Purchase = require('../../db/models/Purchase')
const Cart = require('../../db/models/Cart')
const User = require('../../db/models/User')
const clearCartOfArchivedProductsAndConflicts = require('../utils/clearCartOfArchivedProductsAndConflicts')

module.exports = async (req, res) => {
	try {
		// Fetch user's cart, tutorials and bundles
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')

		const { bundles, tutorials } = userCart

		// if (req.body.test) {
		// 	console.log(userCart)
		// }

		const cartUpdatedMsg = await clearCartOfArchivedProductsAndConflicts(
			userCart
		)

		if (cartUpdatedMsg) {
			return res.status(400).json({ msg: cartUpdatedMsg })
		}

		// Calculate the price
		const tutorialsPrice = tutorials
			.map((t) => t.price)
			.reduce((a, b) => a + b, 0)
		const bundlesPrice = bundles.map((b) => b.price).reduce((a, b) => a + b, 0)

		const price = tutorialsPrice + bundlesPrice

		// @todo Charge user

		// If charged successfully: Create a purchase and relate
		const graphDataPurchase = {
			user_id: req.user.id,
			tutorials,
			bundles,
			price,
		}

		const optionsPurchase = {
			relate: ['tutorials', 'bundles'],
			unrelate: ['tutorials', 'bundles'],
		}

		await Purchase.query().upsertGraphAndFetch(
			graphDataPurchase,
			optionsPurchase
		)

		// Clear user's cart
		await userCart.$relatedQuery('tutorials').unrelate()
		await userCart.$relatedQuery('bundles').unrelate()

		// Fetch user and already bought tutorials and bundles from before
		const user = await User.query()
			.findOne({ id: req.user.id })
			.eager('[bought_tutorials, bought_bundles, cart.[tutorials, bundles]]')

		// Combine old and new tutorials and bundles for upsert
		const graphDataUser = {
			...user,
			bought_tutorials: [...tutorials, ...user.bought_tutorials],
			bought_bundles: [...bundles, ...user.bought_bundles],
		}

		const optionsUser = {
			relate: ['cart', 'bought_tutorials', 'bought_bundles'],
			unrelate: ['cart', 'bought_tutorials', 'bought_bundles'],
		}

		// If charged successfully: Relate tutorials to bought_tutorials and bundles bought_bundles (if bundle is bought, relate both bought_tutorials and bought_bundles)
		await User.query().upsertGraphAndFetch(graphDataUser, optionsUser)

		return res.status(200).json({ tutorials })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}

// 13.05 u 09:00
