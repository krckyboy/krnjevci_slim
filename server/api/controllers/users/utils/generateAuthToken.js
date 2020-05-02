const jwt = require('jsonwebtoken')

const generateAuthToken = (userId) => {
	const payload = {
		user: {
			id: userId,
		},
	}
	// Embedding the user's ID in the token so we can use it for authentication later on.
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: '7 days',
	})
	return token
}

module.exports = generateAuthToken
