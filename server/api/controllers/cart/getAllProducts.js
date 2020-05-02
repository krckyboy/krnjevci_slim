const Cart = require('../../../db/models/Cart')
const Tutorial = require('../../../db/models/Tutorial')
const clearCartOfArchivedTutorials = require('../../utils/clearCartOfArchivedTutorials')
const validatePagination = require('../../utils/validatePagination')

module.exports = async (req, res) => {
	try {
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('tutorials')
			.modifyEager('tutorials', (builder) =>
				builder.select(
					'tutorials.id',
					'tutorials.name',
					'tutorials.description',
					'tutorials.price',
					'tutorials.archived'
				)
			)

		// Check if there are archived tutorials and remove them from cart if that's true.
		const archivedProducts = await clearCartOfArchivedTutorials(userCart)

		let msg = null
		if (archivedProducts) {
			msg = `Archived products found in cart. Cart updated!`
		}

		let start = parseInt(req.query.start)
		let end = parseInt(req.query.end)

		if (!validatePagination({ start, end })) {
			start = 0
			end = 10
		}

		const tutorials = await Tutorial.query()
			.select(
				'tutorials.id',
				'tutorials.name',
				'tutorials.description',
				'tutorials.price',
				'tutorials.archived'
			)
			.joinRelation('cart_tutorials')
			.where({ cart_id: userCart.id })
			.range(start, end)

		const products = {
			tutorials,
		}

		res.json({ products, msg })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
