const reducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			return { text: 'Uspešno ste se ulogovali!', type: 'success' }
		case 'LOGIN_FAILURE':
			return { text: 'Pogrešni parametri za login!', type: 'failure' }
		case 'LOGIN_REQUIRED':
			return {
				text: 'Morate biti ulogovani!',
				type: 'failure',
			}
		case 'LOGOUT':
			return { text: 'Uspešno ste se izlogovali!', type: 'success' }
		case 'CLEAR_MESSAGE':
			return null
		case 'CLEAR_TIMEOUT':
			return {
				...state,
				clearTimeoutFunc: action.payload.clearTimeoutFunc,
			}
		default:
			return state
	}
}

export default reducer
