const Tutorial = require('../../../db/models/Tutorial')
const Vimeo = require('vimeo').Vimeo
const client = new Vimeo(
	process.env.VIMEO_CLIENT_IDENTIFIER,
	process.env.VIMEO_CLIENT_SECRET,
	process.env.VIMEO_PERSONAL_ACCESS_TOKEN
)
const validatePagination = require('../../utils/validatePagination')

// Fetch tutorials' pictures
module.exports = async (req, res) => {
	try {
		let start = parseInt(req.query.start)
		let end = parseInt(req.query.end)

		if (!validatePagination({ start, end })) {
			start = 0
			end = 10
		}

		const tutorials = await Tutorial.query()
			.whereNot({ archived: true })
			.range(start, end)
			.orderBy('created_at', 'desc')
			.select(
				'tutorials.id',
				'tutorials.name',
				'tutorials.description',
				'tutorials.price',
				'tutorials.vimeo_id'
			)

		const tutorialUris = tutorials.results.map((t) => `/videos/${t.vimeo_id}`) // [ '/videos/405862926', '/videos/410448352', '/videos/407271410' ]
		const tutorialUrisString = tutorialUris.join(',') // /videos/405862926,/videos/410448352,/videos/407271410

		client.request(
			{
				method: 'GET',
				path: `/videos/?uris=${tutorialUrisString}&fields=pictures,link`,
			},
			function (error, body, status_code, headers) {
				if (error) {
					// Return status code 404
					console.error(error)
					return res
						.status(404)
						.json({ msg: `The requested video couldn't be found!` })
				}

				// Return only one array of tutorials (tutorials from db and the ones from vimeo destructured into one)
				const combinedTutorials = tutorials.results.map((tDB, i) => {
					const vimeoTutorial = body.data.find((tV) => {
						const id = tV.link.replace('https://vimeo.com/', '')
						return id === tDB.vimeo_id
					})

					delete tDB.vimeo_id

					return { ...tDB, pictures: { ...vimeoTutorial.pictures } }
				})

				const tutorialsToReturn = {
					results: combinedTutorials,
					total: tutorials.total,
				}

				return res.status(200).json({ ...tutorialsToReturn })
			}
		)
	} catch (err) {
		console.error(err)
		res.status(500).send('Server error')
	}
}
