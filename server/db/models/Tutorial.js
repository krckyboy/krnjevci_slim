const { Model } = require('objection')

class Tutorial extends Model {
	static get tableName() {
		return 'tutorials'
	}

	static get relationMappings() {
		const User = require('./User')

		return {
			users: {
				relation: Model.ManyToManyRelation,
				modelClass: User,
				join: {
					from: 'tutorials.id',
					through: {
						from: 'bought_tutorials.tutorial_id',
						to: 'bought_tutorials.user_id',
					},
					to: 'users.id',
				},
			},
		}
	}
}

module.exports = Tutorial
