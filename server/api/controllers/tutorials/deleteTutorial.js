const Tutorial = require('../../../db/models/Tutorial')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query().findOne({ id: paramsId })

		if (!tutorial) {
			return res.status(404).json({ msg: 'No tutorial found!' })
		}

		await tutorial.$query().delete()

		return res.json({ tutorial })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
