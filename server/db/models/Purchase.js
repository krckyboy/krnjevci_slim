const { Model } = require('objection')

class Purchase extends Model {
	static get tableName() {
		return 'purchases'
	}

	static get relationMappings() {
		const User = require('./User')
		const Tutorial = require('./Tutorial')

		return {
			owner: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'purchases.user_id',
					to: 'users.id',
				},
			},
			tutorials: {
				relation: Model.ManyToManyRelation,
				modelClass: Tutorial,
				join: {
					from: 'purchases.id',
					through: {
						from: 'purchase_tutorials.purchase_id',
						to: 'purchase_tutorials.tutorial_id',
					},
					to: 'tutorials.id',
				},
			},
		}
	}
}

module.exports = Purchase
