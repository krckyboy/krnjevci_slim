const { check } = require('express-validator/check')

const registerUserValidation = [
	check('password', 'Unesite lozinku sa više od 5 karaktera!').isLength({
		min: 6,
	}),
	check('email', 'Molimo Vas unesite validnu email adresu!').isEmail(),
]

const loginUserValidation = [
	check('password', 'Lozinka je neophodna!').exists().isLength({
		min: 1,
	}),
	check('email', 'Molimo Vas unesite validnu email adresu!').isEmail(),
]

createTutorialValidation = [
	check('name', 'Ime je neophodno!').exists().isLength({
		min: 1,
	}),

	check('vimeo_id', 'ID tutorijala je neophodan!').exists().isLength({
		min: 1,
	}),
	check('vimeo_preview_id', 'ID za pregled tutorijala je neophodan!')
		.exists()
		.isLength({
			min: 1,
		}),
	check('price', 'Cena je neophodna!').exists().isNumeric().isLength({
		min: 1,
	}),
	check('description', 'Opis je neophodan!').exists().isLength({
		min: 1,
	}),
]

module.exports = {
	registerUserValidation,
	loginUserValidation,
	createTutorialValidation,
}
