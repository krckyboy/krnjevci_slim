export default (dispatch, firstAction, secondAction, state) => {
	// Check if there's a timeout func inside state; If yes, call it
	if (state && state.clearTimeoutFunc) {
		state.clearTimeoutFunc()
	}

	dispatch(firstAction)

	const timeoutId = setTimeout(() => {
		dispatch(secondAction)
	}, 5000)

	dispatch({
		type: 'CLEAR_TIMEOUT',
		payload: {
			clearTimeoutFunc: function() {
				clearInterval(timeoutId)
			},
		},
	})
}
