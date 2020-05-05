const Purchase = require('../../db/models/Purchase')
const Cart = require('../../db/models/Cart')
const User = require('../../db/models/User')

module.exports = async (req, res) => {
	try {
		const {id, amount} = req.body
		console.log(id, amount)

		return res.status(200)
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}

