// Middleware for checking if the logged user is admin user

const User = require('../../db/models/User')

const adminAuth = async function (req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({ msg: 'You need to be logged in!' })
		}

		if (!req.user.is_admin) {
			return res
				.status(401)
				.json({ msg: 'No admin privileges, access denied!' })
		}

		next()
	} catch (err) {
		res.status(401).json({ msg: 'Access denied!' })
	}
}

module.exports = adminAuth
