const Cart = require('../../../db/models/Cart')

module.exports = async (req, res) => {
	try {
		// Check if user already has that tutorial in cart
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[tutorials, bundles]')

		const { tutorials, bundles } = userCart

		if (tutorials.length === 0 && bundles.length === 0) {
			return res.status(400).json({ msg: 'Cart is already empty!' })
		}

		await userCart
			.$relatedQuery('tutorials')
			.unrelate()

		await userCart
			.$relatedQuery('bundles')
			.unrelate()

		res.status(200).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
