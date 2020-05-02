exports.up = (knex) => {
	return knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm;').then(function () {
		return knex.schema
			.createTable('users', (table) => {
				table.increments('id').primary()
				table.timestamps(true, true)
				table.string('email').unique().notNull()
				table.string('password').notNull()
				table.boolean('is_admin').defaultTo(false)
			})
			.createTable('carts', (table) => {
				table.increments('id').primary()
				table.timestamps(true, true)
				table
					.integer('user_id')
					.unsigned()
					.references('id')
					.inTable('users')
					.onDelete('CASCADE')
					.index()
			})
			.createTable('purchases', (table) => {
				table.increments('id').primary()
				table.integer('price').notNull()
				table.timestamps(true, true)
				table
					.integer('user_id')
					.unsigned()
					.references('id')
					.inTable('users')
					.onDelete('CASCADE')
					.index()
			})
			.createTable('tutorials', (table) => {
				table.increments('id').primary()
				table.timestamps(true, true)
				table.string('name').notNull()
				table.string('description')
				table.string('vimeo_id').notNull()
				table.string('vimeo_preview_id')
				table.integer('price').notNull()
				table.boolean('archived').defaultTo(false)
			})
			.createTable('cart_tutorials', (table) => {
				table.increments('id').primary()
				table.timestamps(true, true)
				table.unique(['cart_id', 'tutorial_id'])
				table
					.integer('cart_id')
					.unsigned()
					.references('carts.id')
					.notNull()
					.onDelete('CASCADE')
					.index()
				table
					.integer('tutorial_id')
					.unsigned()
					.references('tutorials.id')
					.notNull()
					.onDelete('CASCADE')
					.index()
			})
			.createTable('purchase_tutorials', (table) => {
				table.increments('id').primary()
				table.timestamps(true, true)
				table.unique(['purchase_id', 'tutorial_id'])
				table
					.integer('purchase_id')
					.unsigned()
					.references('purchases.id')
					.notNull()
					.onDelete('CASCADE')
					.index()
				table
					.integer('tutorial_id')
					.unsigned()
					.references('tutorials.id')
					.notNull()
					.onDelete('CASCADE')
					.index()
			})
			.createTable('bought_tutorials', (table) => {
				table.increments('id').primary()
				table.timestamps(true, true)
				table.unique(['user_id', 'tutorial_id'])
				table
					.integer('user_id')
					.unsigned()
					.references('users.id')
					.notNull()
					.onDelete('CASCADE')
					.index()
				table
					.integer('tutorial_id')
					.unsigned()
					.references('tutorials.id')
					.notNull()
					.onDelete('CASCADE')
					.index()
			})
	})
}

exports.down = (knex) => {
	return knex.schema
		.dropTableIfExists('tb_tutorials')
		.dropTableIfExists('bought_tutorials')
		.dropTableIfExists('cart_tutorials')
		.dropTableIfExists('purchase_tutorials')
		.dropTableIfExists('tutorials')
		.dropTableIfExists('carts')
		.dropTableIfExists('purchases')
		.dropTableIfExists('users')
}
