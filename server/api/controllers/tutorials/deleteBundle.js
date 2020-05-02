const TutorialBundle = require('../../../db/models/TutorialBundle')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const bundle = await TutorialBundle.query().findOne({ id: paramsId })

		if (!bundle) {
			return res.status(404).json({ msg: 'No tutorial bundle found!' })
		}

		await bundle.$query().delete()

		return res.json({ bundle })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
