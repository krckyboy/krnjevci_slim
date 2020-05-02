const TutorialBundle = require('../../../db/models/TutorialBundle')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorialBundle = await TutorialBundle.query().findOne({
			id: paramsId,
		})

		if (!tutorialBundle) {
			return res.status(404).json({ msg: 'No tutorial bundle found!' })
		}

		if (tutorialBundle.archived) {
			return res.status(400).json({ msg: 'Tutorial bundle already archived!' })
		}

		await tutorialBundle.$query().update({
			archived: true,
		})

		tutorialBundle.archived = true

		return res.json({ bundle: tutorialBundle })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
