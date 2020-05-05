const reducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			return { token: action.payload.jwt, user: action.payload.user }
		case 'LOGIN_FAILURE':
		case 'LOGOUT':
		case 'AUTHENTICATION_FAILED':
			return { token: null, user: null }
		default:
			return state
	}
}

export default reducer
