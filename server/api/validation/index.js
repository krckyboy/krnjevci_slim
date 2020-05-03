const { check } = require('express-validator/check')

const registerUserValidation = [
	check(
		'password',
		'Please enter a password with 6 or more characters!'
	).isLength({ min: 6 }),
	check('email', 'Please include a valid email!').isEmail(),
]

const loginUserValidation = [
	check('password', 'Password is required!').exists(),
	check('email', 'Please include a valid email!').isEmail(),
]

createTutorialValidation = [
	check('name', 'Name is required!').exists(),
	check('vimeo_id', 'URL for preview is required!').exists(),
	check('vimeo_preview_id', 'URL for preview is required!').exists(),
	check('price', 'Price is required!').exists().isNumeric(),
	check('description', 'Description is required!').exists(),
]

createTutorialBundleValidation = [
	check('name', 'Name is required!').exists(),
	check('url', 'URL is required!').exists(),
	check('price', 'Price is required!').exists().isNumeric(),
	check('description', 'Description is required!').exists(),
]

module.exports = {
	registerUserValidation,
	loginUserValidation,
	createTutorialValidation,
	createTutorialBundleValidation,
}
