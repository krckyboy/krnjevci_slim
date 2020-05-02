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
		const tutorial = await Tutorial.query().findOne({ id: paramsId })
		const vimeoId = tutorial.vimeo_id
		const vimeoPreviewId = tutorial.preview_url
		let id = vimeoId // @todo Put '' initially

		// Check if user has bought the tutorial, if yes, fetch the video
		// If user hasn't bought the tutorial, fetch the preview video

		client.request(
			{
				method: 'GET',
				path: `/videos/${id}`,
			},
			function (error, body, status_code, headers) {
				if (error) {
					// Return status code 404
					console.error(error)
					return res
						.status(404)
						.json({ msg: `The requested video couldn't be found!` })
				}

				return res.status(200).json({ tutorial: body })
			}
		)
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
