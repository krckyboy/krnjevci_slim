const User = require('../../../db/models/User')

module.exports = async (req, res) => {
	try {
		const user = await User.query().findById(req.user.id)
		await user.$query().delete()
		res.json({ user })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
