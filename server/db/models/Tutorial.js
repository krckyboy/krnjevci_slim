const { Model } = require('objection')

class Tutorial extends Model {
	static get tableName() {
		return 'tutorials'
	}

	static get relationMappings() {
		const User = require('./User')
		const TutorialBundle = require('./TutorialBundle')

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
			bundles: {
				relation: Model.ManyToManyRelation,
				modelClass: TutorialBundle,
				join: {
					from: 'tutorials.id',
					through: {
						from: 'tb_tutorials.tutorial_id',
						to: 'tb_tutorials.tutorial_bundle_id',
					},
					to: 'tutorial_bundles.id',
				},
			},
		}
	}
}

module.exports = Tutorial
