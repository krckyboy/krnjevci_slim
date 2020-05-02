const Tutorial = require('../../../db/models/Tutorial')
const Cart = require('../../../db/models/Cart')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query()
			.findOne({ id: paramsId })
			.select('id', 'name', 'description', 'price', 'archived')

		if (!tutorial || tutorial.archived) {
			return res.status(404).json({ msg: `Artikl ne postoji!` })
		}

		// Fetch user's cart, tutorials
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('tutorials')

		// Check if user has already bought that tutorial
		const tutorialBought = await Tutorial.query()
			.joinRelation('users')
			.findOne('tutorial_id', paramsId)
			.andWhere('user_id', req.user.id)

		if (tutorialBought) {
			// Send the message to user about which t/b are removed from cart due to them being archived
			return res.status(400).json({
				msg: `Ne možete dodati artikl koji sve već kupili!`,
			})
		}

		const { tutorials: tutorialsInCart } = userCart
		const tutorialAlreadyAdded = tutorialsInCart.some((t) => t.id === paramsId)

		// If tutorial already added to cart
		if (tutorialAlreadyAdded) {
			return res.status(400).json({ msg: 'Artikl je već dodat u korpu!' })
		}

		await userCart.$relatedQuery('tutorials').relate(tutorial) // or .relate({id: tutorial.id})

		res.json({ tutorial })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
