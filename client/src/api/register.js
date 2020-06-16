import axios from 'axios'

export default async function ({ email, password }) {
	try {
		const res = await axios.post('/api/users/register', {
			email,
			password,
		})

		return res.data
	} catch (e) {
		return { error: e }
	}
}
