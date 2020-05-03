const Tutorial = require('../../../db/models/Tutorial')
const Vimeo = require('vimeo').Vimeo
const client = new Vimeo(
	process.env.VIMEO_CLIENT_IDENTIFIER,
	process.env.VIMEO_CLIENT_SECRET,
	process.env.VIMEO_PERSONAL_ACCESS_TOKEN
)

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const tutorial = await Tutorial.query()
			.findOne({ id: paramsId })
			.select(
				'tutorials.id',
				'tutorials.name',
				'tutorials.description',
				'tutorials.price',
				'tutorials.archived',
				'tutorials.vimeo_id',
				'tutorials.vimeo_preview_id'
			)

		if (!tutorial) {
			return res.status(404).json({ msg: `Tutorijal ne postoji!` })
		}

		if (tutorial.archived && !req.user.is_admin) {
			return res.status(404).json({ msg: `Tutorijal ne postoji!` })
		}

		if (req.user.is_admin) {
			return res.status(200).json({ tutorial, userBoughtTutorial: true })
		}

		// Check if user has already bought that tutorial
		const tutorialBought = await Tutorial.query()
			.joinRelation('users')
			.findOne('tutorial_id', paramsId)
			.andWhere('user_id', req.user.id)

		const userBoughtTutorial = tutorialBought ? true : false

		if (!userBoughtTutorial) {
			delete tutorial.vimeo_id
			return res.status(200).json({ tutorial, userBoughtTutorial })
		} else {
			return res.status(200).json({ tutorial, userBoughtTutorial })
		}
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
