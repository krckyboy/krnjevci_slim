// Middleware for checking if the authentication token that's sent from the client is valid / exists

const jwt = require('jsonwebtoken')
const User = require('../../db/models/User')

const auth = async function (req, res, next) {
	try {
		const token = req.header('Authorization').replace('Bearer ', '')

		if (!token) {
			return res.status(401).json({ msg: 'Nemate token, pristup onemogućen!' })
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const user = await User.query().findById(decoded.user.id)

		if (!user) {
			return res
				.status(401)
				.json({ msg: 'Token nije ispravan, pristup onemogućen!' })
		}

		req.user = user

		next()
	} catch (err) {
		res.status(401).json({ msg: 'Token nije ispravan, pristup onemogućen!' })
	}
}

module.exports = auth
