// Middleware for checking if the logged user is admin user

const User = require('../../db/models/User')

const adminAuth = async function (req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({ msg: 'Morate biti ulogovani!' })
		}

		if (!req.user.is_admin) {
			return res.status(401).json({ msg: 'Pristup onemogućen!' })
		}

		next()
	} catch (err) {
		res.status(401).json({ msg: 'Pristup onemogućen!' })
	}
}

module.exports = adminAuth
