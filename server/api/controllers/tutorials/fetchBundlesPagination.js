const TutorialBundle = require('../../../db/models/TutorialBundle')
const Vimeo = require('vimeo').Vimeo
const client = new Vimeo(
	process.env.VIMEO_CLIENT_IDENTIFIER,
	process.env.VIMEO_CLIENT_SECRET,
	process.env.VIMEO_PERSONAL_ACCESS_TOKEN
)
const validatePagination = require('../../utils/validatePagination')

// Fetch bundles' pictures
module.exports = async (req, res) => {
	try {
		let start = parseInt(req.query.start)
		let end = parseInt(req.query.end)

		if (!validatePagination({ start, end })) {
			start = 0
			end = 10
		}

		const bundles = await TutorialBundle.query()
			.whereNot({ archived: true })
			.range(start, end)
			.orderBy('created_at', 'desc')
			.select('id', 'name', 'price', 'vimeo_id')

		const bundleUris = bundles.results.map((t) => `/videos/${t.vimeo_id}`) // [ '/videos/405862926', '/videos/410448352', '/videos/407271410' ]
		const bundleUrisString = bundleUris.join(',') // /videos/405862926,/videos/410448352,/videos/407271410

		client.request(
			{
				method: 'GET',
				path: `/videos/?uris=${bundleUrisString}&fields=pictures,link`,
			},
			function (error, body, status_code, headers) {
				if (error) {
					// Return status code 404
					console.error(error)
					return res
						.status(404)
						.json({ msg: `The requested video couldn't be found!` })
				}

				// Return only one array of bundles (bundles from db and the ones from vimeo destructured into one)
				const combinedBundles = bundles.results.map((vBDB, i) => {
					const vimeoBundle = body.data.find((bV) => {
						const id = bV.link.replace('https://vimeo.com/', '')
						return id === vBDB.vimeo_id
					})

					delete vBDB.vimeo_id

					return { ...vBDB, pictures: { ...vimeoBundle.pictures } }
				})

				const bundlesToReturn = {
					results: combinedBundles,
					total: bundles.total,
				}

				return res.status(200).json({ bundles: bundlesToReturn })
			}
		)
	} catch (err) {
		console.error(err)
		res.status(500).send('Server error')
	}
}
