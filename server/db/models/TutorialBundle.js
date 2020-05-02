const { Model } = require('objection')

class TutorialBundle extends Model {
	static get tableName() {
		return 'tutorial_bundles'
	}

	static get relationMappings() {
		const Tutorial = require('./Tutorial')
		const User = require('./User')

		return {
			tutorials: {
				relation: Model.ManyToManyRelation,
				modelClass: Tutorial,
				join: {
					from: 'tutorial_bundles.id',
					through: {
						from: 'tb_tutorials.tutorial_bundle_id',
						to: 'tb_tutorials.tutorial_id',
					},
					to: 'tutorials.id',
				},
			},
			users: {
				relation: Model.ManyToManyRelation,
				modelClass: User,
				join: {
					from: 'tutorial_bundles.id',
					through: {
						from: 'bought_bundles.bundle_id',
						to: 'bought_bundles.user_id',
					},
					to: 'users.id',
				},
			},
		}
	}
}

module.exports = TutorialBundle
