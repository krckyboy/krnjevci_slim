const { validationResult } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const generateAuthToken = require('./utils/generateAuthToken')
const User = require('../../../db/models/User')

module.exports = async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	try {
		const { email, password } = req.body
		const user = await User.query().findOne({ email })

		if (!user) {
			return res
				.status(400)
				.json({ msg: 'Uneti podaci se ne poklapaju sa bazom podataka!' })
		}

		const passwordsMatch = await bcrypt.compare(password, user.password)

		if (!passwordsMatch) {
			return res
				.status(400)
				.json({ msg: 'Uneti podaci se ne poklapaju sa bazom podataka!' })
		}

		const token = generateAuthToken(user.id)

		res.json({ token })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
