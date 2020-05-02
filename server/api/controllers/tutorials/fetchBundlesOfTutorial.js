const Tutorial = require('../../../db/models/Tutorial')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query()
			.findOne({ id: paramsId })
			.eager('bundles')

		if (!tutorial) {
			return res.status(404).json({ msg: 'No tutorial found!' })
		}

		return res.json({ bundles: tutorial.bundles })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
