const { Model } = require('objection')

class Tutorial extends Model {
	static get tableName() {
		return 'tutorials'
	}

	static get relationMappings() {
		const User = require('./User')
		const Cart = require('./Cart')

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
			cart_tutorials: {
				relation: Model.ManyToManyRelation,
				modelClass: Cart,
				join: {
					from: 'tutorials.id',
					through: {
						from: 'cart_tutorials.tutorial_id',
						to: 'cart_tutorials.cart_id',
					},
					to: 'carts.id',
				},
			},
		}
	}
}

module.exports = Tutorial
