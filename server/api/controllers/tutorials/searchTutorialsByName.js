const db = require('../../../db/index')

module.exports = async (req, res) => {
	try {
		const search = req.body.search // The value of the search input
		let tutorials

		const formattedSearchValue = search
			.toLowerCase()
			.replace(/[^a-zA-Z ]/g, '') // This gets rid of all the non alphanumerical characters (also . - )
			.trim()

		const rawQuery =
			'SELECT id, name, price, SIMILARITY(name, ?) AS sml FROM tutorials WHERE NOT archived=true ORDER BY sml DESC LIMIT 5;'

		if (formattedSearchValue) {
			tutorials = await db.raw(rawQuery, formattedSearchValue)
			if (tutorials.rows) {
				tutorials = tutorials.rows.filter((skill) => skill.sml > 0.1)
			} else {
				return res.status(404).send()
			}
		} else {
			return res.status(404).send()
		}

		return res.json({ tutorials })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
