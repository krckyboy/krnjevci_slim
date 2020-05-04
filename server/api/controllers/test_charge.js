const Purchase = require('../../db/models/Purchase')
const Cart = require('../../db/models/Cart')
const User = require('../../db/models/User')

module.exports = async (req, res) => {
	try {
		// Fetch user's cart, tutorials
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('tutorials')

		const { tutorials } = userCart

		// Check if there are archived tutorials and remove them from cart if that's true.
		const archivedTutorials = tutorials.filter((t) => t.archived)

		if (archivedTutorials.length > 0) {
			return res.status(400).json({
				msg: `Pronađeni su arhivirani artikli u korpi. Korpa je osvežena. Pokušajte ponovo!`,
			})
		}

		// Calculate the price
		const price = tutorials
			.filter((t) => !t.archived)
			.map((t) => t.price)
			.reduce((a, b) => a + b, 0)

		// @todo Charge user

		// If charged successfully: Create a purchase and relate
		const graphDataPurchase = {
			user_id: req.user.id,
			tutorials,
			price,
		}

		const optionsPurchase = {
			relate: ['tutorials'],
			unrelate: ['tutorials'],
		}

		await Purchase.query().upsertGraphAndFetch(
			graphDataPurchase,
			optionsPurchase
		)

		// Clear user's cart
		await userCart.$relatedQuery('tutorials').unrelate()

		// Fetch user and already bought tutorials from before
		const user = await User.query()
			.findOne({ id: req.user.id })
			.eager('[bought_tutorials, cart.[tutorials]]')

		// Combine old and new tutorials for upsert
		const graphDataUser = {
			...user,
			bought_tutorials: [...tutorials, ...user.bought_tutorials],
		}

		const optionsUser = {
			relate: ['cart', 'bought_tutorials'],
			unrelate: ['cart', 'bought_tutorials'],
		}

		// If charged successfully: Relate tutorials to bought_tutorials
		await User.query().upsertGraphAndFetch(graphDataUser, optionsUser)

		return res.status(200).json({ tutorials })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}

