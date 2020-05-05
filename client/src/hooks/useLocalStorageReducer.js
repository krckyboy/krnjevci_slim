import { useReducer, useEffect } from 'react'

export default function useLocalStorageReducer(key, defaultValue, reducer) {
	// Make a piece of state, based off of value in localStorage (or default)
	const [state, dispatch] = useReducer(reducer, defaultValue, () => {
		let val
		try {
			val = JSON.parse(window.localStorage.getItem(key)) || defaultValue
		} catch (error) {
			val = defaultValue
		}
		return val
	})

	// Update localstorage whenever the state changes
	useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(state))
	}, [state, key])

	return [state, dispatch]
}
 