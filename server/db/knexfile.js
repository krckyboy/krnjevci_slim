const config = {
	client: 'postgresql',
	connection: {
		database: 'krnjevci',
		user: 'postgres',
		password: 'password'
	},
	useNullAsDefault: true,
}

module.exports = Object.assign({}, config, {
	development: config,
	staging: config,
	production: config,
})
