import axios from 'axios'

export default async function() {
	try {
		const res = await axios.get(`/users/me`)
		return res.data
	} catch (e) {
		return { error: e }
	}
}
