const Tutorial = require('../../../db/models/Tutorial')
const Cart = require('../../../db/models/Cart')
const clearCartOfArchivedTutorialsAndBundles = require('../../utils/clearCartOfArchivedTutorials')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query()
			.findOne({ id: paramsId })
			.select('id', 'name', 'description', 'price')

		if (!tutorial) {
			return res.status(404).json({ msg: `Tutorial doesn't exist!` })
		}

		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')

		// Check if there are archived tutorials or bundles in cart and remove them from cart if that's true.
		const archivedProductNames = await clearCartOfArchivedTutorialsAndBundles(
			userCart
		)

		let msg = null
		if (archivedProductNames) {
			msg = `Archived products found in cart. Cart updated!`
		}

		const { tutorials: tutorialsInCart } = userCart
		
		// Check if user has that tutorial in cart
		const tutorialAlreadyAdded = tutorialsInCart.some((t) => t.id === paramsId)

		if (!tutorialAlreadyAdded) {
			return res
				.status(404)
				.json({ msg: `You don't have that tutorial in cart!` })
		}

		await userCart
			.$relatedQuery('tutorials')
			.unrelate()
			.where({ tutorial_id: tutorial.id })

		res.json({ tutorial, msg })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
