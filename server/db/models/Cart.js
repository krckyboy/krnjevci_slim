const { Model } = require('objection')

class Cart extends Model {
	static get tableName() {
		return 'carts'
	}

	static get relationMappings() {
		const User = require('./User')
		const Tutorial = require('./Tutorial')
		const TutorialBundle = require('./TutorialBundle')

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
			bundles: {
				relation: Model.ManyToManyRelation,
				modelClass: TutorialBundle,
				join: {
					from: 'carts.id',
					through: {
						from: 'cart_bundles.cart_id',
						to: 'cart_bundles.bundle_id',
					},
					to: 'tutorial_bundles.id',
				},
			},
		}
	}
}

module.exports = Cart
