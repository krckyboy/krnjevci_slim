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
		const existingUsers = await User.query().where({ email })

		if (existingUsers.length > 0) {
			for (let user of existingUsers) {
				if (user.email === email) {
					return res
						.status(400)
						.json({ msg: 'Već postoji nalog sa tim email-om!' })
				}
			}
		}

		const hashedPassword = await bcrypt.hash(password, 8)

		const is_admin = email === 'dusan.todorovic.2016@gmail.com' ? true : false

		const newUser = await User.query().insert({
			email,
			password: hashedPassword,
			is_admin,
		})

		// Create a cart
		await newUser.$relatedQuery('cart').insert({ user_id: newUser.id })

		const token = generateAuthToken(newUser.id)

		res.status(201).json({ token })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
