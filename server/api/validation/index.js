const { check } = require('express-validator/check')

const registerUserValidation = [
	check('password', 'Unesite lozinku sa više od 5 karaktera!').isLength({
		min: 6,
	}),
	check('email', 'Molimo Vas unesite validnu email adresu!').isEmail(),
]

const loginUserValidation = [
	check('password', 'Lozinka je neophodna!').exists(),
	check('email', 'Molimo Vas unesite validnu email adresu!').isEmail(),
]

createTutorialValidation = [
	check('name', 'Ime je neophodno!').exists(),
	check('vimeo_id', 'ID tutorijala je neophodan!').exists(),
	check('vimeo_preview_id', 'ID za pregled tutorijala je neophodan!').exists(),
	check('price', 'Cena je neophodna!').exists().isNumeric(),
	check('description', 'Opis je neophodan!').exists(),
]

module.exports = {
	registerUserValidation,
	loginUserValidation,
	createTutorialValidation,
}
