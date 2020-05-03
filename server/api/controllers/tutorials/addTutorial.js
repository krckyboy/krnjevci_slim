const Tutorial = require('../../../db/models/Tutorial')
const { validationResult } = require('express-validator/check')
const checkIfObjectValuesAreOfSpecificType = require('../../utils/checkIfArrayValuesAreOfSpecificType')

module.exports = async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	try {
		const { name, vimeo_id, vimeo_preview_id, price, description } = req.body

		const fieldsArr = [name, vimeo_id, vimeo_preview_id, description]

		const checkIfString = checkIfObjectValuesAreOfSpecificType(
			fieldsArr,
			'string'
		)

		if (typeof price !== 'number') {
			return res.status(400).json({ msg: 'Niste pravilno uneli polja!' })
		}

		if (!checkIfString) {
			return res.status(400).json({ msg: 'Niste pravilno uneli polja!' })
		}

		// Check if tutorial with that name exists
		const existingTutorial = await Tutorial.query().findOne({ name })

		if (existingTutorial) {
			return res
				.status(400)
				.json({ msg: 'Već postoji tutorijal sa takvim imenom!' })
		}

		// Create tutorial
		const newTutorial = await Tutorial.query().insert({
			name,
			vimeo_id,
			vimeo_preview_id,
			price,
			description,
		})

		res.status(201).json({ tutorial: newTutorial })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
