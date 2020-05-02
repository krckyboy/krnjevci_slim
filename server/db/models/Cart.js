const { Model } = require('objection')

class Cart extends Model {
	static get tableName() {
		return 'carts'
	}

	static get relationMappings() {
		const User = require('./User')
		const Tutorial = require('./Tutorial')

		return {
			owner: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'carts.user_id',
					to: 'users.id',
				},
			},
			tutorials: {
				relation: Model.ManyToManyRelation,
				modelClass: Tutorial,
				join: {
					from: 'carts.id',
					through: {
						from: 'cart_tutorials.cart_id',
						to: 'cart_tutorials.tutorial_id',
					},
					to: 'tutorials.id',
				},
			},
		}
	}
}

module.exports = Cart
