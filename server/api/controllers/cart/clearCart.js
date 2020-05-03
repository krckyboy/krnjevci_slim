const Cart = require('../../../db/models/Cart')

module.exports = async (req, res) => {
	try {
		// Check if user already has that tutorial in cart
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[tutorials]')

		const { tutorials } = userCart

		if (tutorials.length === 0) {
			return res.status(400).json({ msg: `Korpa je već prazna!` })
		}

		await userCart.$relatedQuery('tutorials').unrelate()

		res.status(200).send()
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
