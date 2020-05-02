const Tutorial = require('../../../db/models/Tutorial')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query().findOne({ id: paramsId })

		if (!tutorial) {
			return res.status(404).json({ msg: 'No tutorial found!' })
		}

		if (tutorial.archived) {
			return res.status(400).json({ msg: 'Tutorial already archived!' })
		}

		await tutorial.$query().update({
			archived: true,
		})

		tutorial.archived = true

		return res.json({ tutorial })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
