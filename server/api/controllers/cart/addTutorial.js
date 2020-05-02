const Tutorial = require('../../../db/models/Tutorial')
const Cart = require('../../../db/models/Cart')
const clearCartOfArchivedTutorialsAndBundles = require('../../utils/clearCartOfArchivedTutorialsAndBundles')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query()
			.findOne({ id: paramsId })
			.select('id', 'name', 'description', 'price', 'archived')

		if (!tutorial) {
			return res.status(404).json({ msg: `Tutorial doesn't exist!` })
		}

		if (tutorial.archived) {
			return res
				.status(400)
				.json({ msg: `You cannot buy this tutorial as it's archived!` })
		}

		// Fetch user's cart, tutorials and bundles
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')

		// Check if user has already bought that tutorial
		const tutorialBought = await Tutorial.query()
			.joinRelation('users')
			.findOne('tutorial_id', paramsId)
			.andWhere('user_id', req.user.id)

		if (tutorialBought) {
			// Send the message to user about which t/b are removed from cart due to them being archived
			return res.status(400).json({
				msg: `Purchase failed - you've already bought this tutorial!`,
			})
		}

		const { tutorials: tutorialsInCart } = userCart
		const tutorialAlreadyAdded = tutorialsInCart.some((t) => t.id === paramsId)

		if (tutorialAlreadyAdded) {
			return res
				.status(400)
				.json({ msg: 'That tutorial has already been added to the cart!' })
		}

		await userCart.$relatedQuery('tutorials').relate(tutorial) // or .relate({id: tutorial.id})

		res.json({ tutorial })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
