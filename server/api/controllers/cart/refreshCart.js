const clearCartOfArchivedProductsAndConflicts = require('../../utils/clearCartOfArchivedProductsAndConflicts')

module.exports = async (req, res) => {
	try {
		// Check if user already has that tutorial in cart
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')

		const cartUpdatedMsg = await clearCartOfArchivedProductsAndConflicts(
			userCart
		)

		res.status(200).json({ msg: cartUpdatedMsg })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
