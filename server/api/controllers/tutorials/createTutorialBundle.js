const TutorialBundle = require('../../../db/models/TutorialBundle')
const Tutorial = require('../../../db/models/Tutorial')

module.exports = async (req, res) => {
	// @todo Add validation
	// Add validation for tutorials
	try {
		// @todo Validate fields
		const { name, vimeo_id, price, description, tutorialIds } = req.body

		// Check if bundle with that name exists
		const existingBundle = await TutorialBundle.query().findOne({ name })
		if (existingBundle) {
			return res
				.status(400)
				.json({ msg: 'There is already a bundle under that name!' })
		}

		// "todo Check if all those tutorials exist and are not archived
		const tutorials = await Tutorial.query().whereIn('id', tutorialIds)

		// Relate those tutorials with the bundle
		const graphData = {
			name,
			vimeo_id,
			price,
			description,
			tutorials: tutorials,
		}
		const options = {
			relate: ['tutorials'],
			unrelate: ['tutorials'],
		}

		// Create bundle with related tutorials
		const newBundle = await TutorialBundle.query().upsertGraphAndFetch(
			graphData,
			options
		)
		
		res.status(201).json({ bundle: newBundle })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
