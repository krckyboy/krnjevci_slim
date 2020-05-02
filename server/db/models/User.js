const { Model } = require('objection')

class User extends Model {
	static get tableName() {
		return 'users'
	}

	static get relationMappings() {
		const Tutorial = require('./Tutorial')
		const Cart = require('./Cart')

		return {
			bought_tutorials: {
				relation: Model.ManyToManyRelation,
				modelClass: Tutorial,
				join: {
					from: 'users.id',
					through: {
						from: 'bought_tutorials.user_id',
						to: 'bought_tutorials.tutorial_id',
					},
					to: 'tutorials.id',
				},
			},
			cart: {
				relation: Model.HasOneRelation,
				modelClass: Cart,
				join: {
					from: 'users.id',
					to: 'carts.user_id',
				},
			},
		}
	}
}

module.exports = User
