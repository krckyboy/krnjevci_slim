const TutorialBundle = require('../../../db/models/TutorialBundle')
const Vimeo = require('vimeo').Vimeo
const client = new Vimeo(
	process.env.VIMEO_CLIENT_IDENTIFIER,
	process.env.VIMEO_CLIENT_SECRET,
	process.env.VIMEO_PERSONAL_ACCESS_TOKEN
)

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const bundle = await TutorialBundle.query()
			.findOne({ id: paramsId })
			.eager('tutorials')
			.modifyEager('tutorials', (builder) =>
				builder.select(
					'tutorials.id',
					'tutorials.name',
					'tutorials.description',
					'tutorials.price'
				)
			)

		client.request(
			{
				method: 'GET',
				path: `/videos/${bundle.vimeo_id}?fields=pictures,link,duration,uri`,
			},
			function (error, body, status_code, headers) {
				if (error) {
					// Return status code 404
					console.error(error)
					return res
						.status(404)
						.json({ msg: `The requested video couldn't be found!` })
				}

				return res
					.status(200)
					.json({ bundle: { ...body, tutorials: bundle.tutorials } })
			}
		)
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
